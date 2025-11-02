import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import {
  AuthenticatorTransportFuture,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
  type GenerateRegistrationOptionsOpts,
} from "@simplewebauthn/server";
import {
  cachePasskey,
  cacheRegistrationOptions,
  getAddressBindingCellByCkbAddress,
  getPasskeyFromCache,
  getRegistrationOptionsFromCache,
  Passkey,
  rpID,
} from "./libs/address-binding";
import { ccc } from "@ckb-ccc/shell";
import { getProtocolTypeScript } from "./libs/utils";
import { AddressBindingData } from "ssri-ckbdao/types";
import BeautifyConsole from "beautify-console-log";
import { readCache, writeCache } from "./libs/cache";

const log = BeautifyConsole.getInstance();

const serverKey = process.env.NETLIFY_API_AUTHENTICATOR_PRIVATE_KEY;
const rpcUrl = process.env.NEXT_PUBLIC_CKB_RPC_URL || "https://testnet.ckb.dev";
if (!serverKey) {
  log.error("config_error_post", { hasServerKey: !!serverKey });
  throw new Error("Missing private key");
}
const client = new ccc.ClientPublicTestnet({ url: rpcUrl });
const respond = (
  statusCode: number,
  payload: Record<string, unknown>
): HandlerResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

export const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET":
      return await optionsHandler(event);
    case "POST":
      const step = event.queryStringParameters?.step as
        | "verification"
        | "signature";
      if (step === "verification") {
        return await verificationHandler(event);
      } else if (step === "signature") {
        return await signatureHandler(event);
      } else {
        return respond(400, { success: false, error: "invalid_step" });
      }
    default:
      return respond(405, { success: false, error: "method_not_allowed" });
  }
};

export default handler;

async function optionsHandler(event: HandlerEvent): Promise<HandlerResponse> {
  log.info("request", {
    method: event.httpMethod,
    path: event.path,
    query: event.rawQuery || event.queryStringParameters,
  });

  if (event.httpMethod !== "POST") {
    log.error("method_not_allowed");
    return respond(405, { success: false, error: "method_not_allowed" });
  }

  const walletAddress = event.queryStringParameters?.walletAddress as string;
  if (!walletAddress) {
    log.error("missing_wallet_address");
    return respond(400, { success: false, error: "missing_wallet_address" });
  }

  const protocolTypeScript = ccc.Script.from(getProtocolTypeScript());

  // Find binding cells by ckbAddress to provide excludeCredentials
  const addressBindingCell = await getAddressBindingCellByCkbAddress(
    walletAddress,
    client,
    protocolTypeScript.hash()
  );
  let excludeCredentials: {
    id: Base64URLString;
    transports: AuthenticatorTransportFuture[];
  }[] = [];
  if (addressBindingCell) {
    log.error("Found Address binding cell. ");
    const addressBindingData = AddressBindingData.decode(
      addressBindingCell.outputData
    );
    if (addressBindingData) {
      const passkey = JSON.parse(addressBindingData.passkey_data) as Passkey;
      excludeCredentials.push({
        id: passkey.id,
        transports: passkey.transports ?? [],
      });
    }
    return respond(400, {
      success: false,
      error:
        "address_binding_cell_found_for_wallet_address. Please revoke the binding first.",
    });
  }

  try {
    const options = await generateRegistrationOptions({
      rpName: "CKB Auth",
      rpID: "localhost",
      userName: walletAddress,
      excludeCredentials: excludeCredentials,
    });

    // TODO: Cache the options indexed by walletAddress
    await cacheRegistrationOptions(walletAddress, options);

    return respond(200, {
      success: true,
      options,
      challenge: options.challenge,
    });
  } catch (error) {
    log.error("options_generation_error", {
      message: (error as Error)?.message,
    });
    return respond(500, {
      success: false,
      error: "internal_server_error",
    });
  }
}

async function verificationHandler(
  event: HandlerEvent
): Promise<HandlerResponse> {
  log.info("request", {
    method: event.httpMethod,
    path: event.path,
    query: event.rawQuery || event.queryStringParameters,
  });

  const walletAddress = event.queryStringParameters?.walletAddress as string;
  if (!walletAddress) {
    log.error("missing_wallet_address");
    return respond(400, { success: false, error: "missing_wallet_address" });
  }

  let body: RegistrationResponseJSON;
  try {
    body = JSON.parse(event.body ?? "{}") as RegistrationResponseJSON;
  } catch (error) {
    log.error("json_parse_error", { message: (error as Error)?.message });
    return respond(400, { success: false, error: "invalid_json" });
  }

  // TODO: Get the options from the cache indexed by walletAddress

  const options: PublicKeyCredentialCreationOptionsJSON =
    await getRegistrationOptionsFromCache(walletAddress);

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: options.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      log.error("verification_failed", { walletAddress });
      return respond(400, {
        success: false,
        verified: false,
        error: "registration_verification_failed",
      });
    }

    const { registrationInfo } = verification;
    const { credential, credentialDeviceType, credentialBackedUp } =
      registrationInfo;

    const newPasskey: Passkey = {
      // Created by `generateRegistrationOptions()` in Step 1
      webauthnUserID: options.user.id,
      // A unique identifier for the credential
      id: credential.id,
      // The public key bytes, used for subsequent authentication signature verification
      publicKey: credential.publicKey,
      // The number of times the authenticator has been used on this site so far
      counter: credential.counter,
      // How the browser can talk with this credential's authenticator
      transports: credential.transports,
      // Whether the passkey is single-device or multi-device
      deviceType: credentialDeviceType,
      // Whether the passkey has been backed up in some way
      backedUp: credentialBackedUp,
    };

    await cachePasskey(walletAddress, newPasskey);

    return respond(200, {
      success: true,
      passkey: newPasskey,
    });
  } catch (error) {
    log.error("verification_error", { message: (error as Error)?.message });
    return respond(500, {
      success: false,
      error: "internal_server_error",
    });
  }
}

async function signatureHandler(event: HandlerEvent): Promise<HandlerResponse> {
  log.info("request", {
    method: event.httpMethod,
    path: event.path,
    query: event.rawQuery || event.queryStringParameters,
  });

  const walletAddress = event.queryStringParameters?.walletAddress as string;
  if (!walletAddress) {
    log.error("missing_wallet_address");
    return respond(400, { success: false, error: "missing_wallet_address" });
  }

  const passkey = await getPasskeyFromCache(walletAddress);

  if (!passkey) {
    log.error("passkey_not_found");
    return respond(400, { success: false, error: "passkey_not_found" });
  }

  let tx: ccc.Transaction;
  try {
    tx = ccc.Transaction.fromBytes(event.body ?? "{}");
  } catch (error) {
    log.error("transaction_parse_error", {
      message: (error as Error)?.message,
    });
    return respond(400, { success: false, error: "invalid_transaction" });
  }

  // TODO: Verify the transaction on both the output and output data.

  // TODO: Sign with server signer

  // Return the signed transaction
  return respond(200, {
    success: true,
    tx: tx.toBytes(),
  });
}
