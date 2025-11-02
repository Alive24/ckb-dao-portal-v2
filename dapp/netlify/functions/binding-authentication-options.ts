import type { Handler, HandlerResponse } from "@netlify/functions";
import BeautifyConsole from "beautify-console-log";
import {
  generateAuthenticationOptions,
  type GenerateAuthenticationOptionsOpts,
} from "@simplewebauthn/server";
import { ccc } from "@ckb-ccc/shell";
import { getBindingCellByCkbAddress } from "./libs/address-binding";
import { deploymentManager } from "@/lib/ckb/deployment-manager";
import { getProtocolTypeScript } from "./libs/utils";

const log = BeautifyConsole.getInstance();

interface AuthenticationOptionsRequest {
  walletAddress: string;
}

const respond = (
  statusCode: number,
  payload: Record<string, unknown>
): HandlerResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

export const handler: Handler = async (event) => {
  const serverKey = process.env.NETLIFY_API_AUTHENTICATOR_PRIVATE_KEY;
  const rpcUrl =
    process.env.NEXT_PUBLIC_CKB_RPC_URL || "https://testnet.ckb.dev";
  if (!serverKey) {
    log.error("config_error_post", { hasServerKey: !!serverKey });
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "missing_private_key" }),
    };
  }
  const client = new ccc.ClientPublicTestnet({ url: rpcUrl });

  log.info("request", {
    method: event.httpMethod,
    path: event.path,
    query: event.rawQuery || event.queryStringParameters,
  });

  if (event.httpMethod !== "POST") {
    log.error("method_not_allowed");
    return respond(405, { success: false, error: "method_not_allowed" });
  }

  let body: AuthenticationOptionsRequest;
  try {
    body = JSON.parse(event.body ?? "{}") as AuthenticationOptionsRequest;
  } catch (error) {
    log.error("json_parse_error", { message: (error as Error)?.message });
    return respond(400, { success: false, error: "invalid_json" });
  }

  if (!body?.walletAddress) {
    log.error("validation_error", { body });
    return respond(400, {
      success: false,
      error: "missing_required_fields",
    });
  }

  const protocolTypeScript = ccc.Script.from(getProtocolTypeScript());

  const bindingCell = await getBindingCellByCkbAddress(
    body.walletAddress,
    client,
    protocolTypeScript.hash()
  );

  const headers = event.headers || {};
  const host =
    headers.host ||
    headers.Host ||
    headers["x-forwarded-host"] ||
    headers["X-Forwarded-Host"] ||
    "localhost:8888";
  const rpID = host.split(":")[0] || "localhost";

  const opts: GenerateAuthenticationOptionsOpts = {
    rpID,
    timeout: 60_000,
    userVerification: "preferred",
    allowCredentials: storedCredentials.map((credential) => ({
      id: Buffer.from(credential.credentialID, "base64"),
      transports: credential.transports,
    })),
  };

  try {
    const options = await generateAuthenticationOptions(opts);
    authenticationChallenges.set(body.userId, options.challenge);

    log("options_generated", {
      userId: body.userId,
      challenge: options.challenge,
      allowCredentialsCount: opts.allowCredentials?.length ?? 0,
    });

    return respond(200, {
      success: true,
      options,
      challenge: options.challenge,
    });
  } catch (error) {
    log("options_generation_error", { message: (error as Error)?.message });
    return respond(500, {
      success: false,
      error: "internal_server_error",
    });
  }
};

export default handler;
