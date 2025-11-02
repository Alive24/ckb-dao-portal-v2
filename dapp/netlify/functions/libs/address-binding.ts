import { deploymentManager } from "@/lib/ckb/deployment-manager";
import { ccc } from "@ckb-ccc/shell";
import { ConnectedTypeID } from "ssri-ckbdao/types";

import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  Base64URLString,
} from "@simplewebauthn/server";
import { readCache, writeCache } from "./cache";

export const getAddressBindingCellByCkbAddress = async (
  ckbAddress: string,
  client: ccc.Client,
  protocolTypeHash: ccc.HexLike
): Promise<ccc.Cell | undefined> => {
  const address = await ccc.Address.fromString(ckbAddress, client);
  const lockScript = address.script;
  // TODO: Properly construct address binding Cell Type here
  const addressBindingCellCodeHash = deploymentManager.getContractCodeHash(
    deploymentManager.getCurrentNetwork(),
    "ckbdaoAddressBindingType"
  );
  if (!addressBindingCellCodeHash) {
    throw new Error("Address binding cell code hash not found");
  }
  const addressBindingCellConnectedTypeIDHex = ccc.hexFrom(
    ConnectedTypeID.encode({
      type_id: protocolTypeHash,
      connected_key: lockScript.hash(),
    })
  );

  const addressBindingCellTypeScript = ccc.Script.from({
    codeHash: addressBindingCellCodeHash,
    hashType: "type",
    args: addressBindingCellConnectedTypeIDHex,
  });

  // Search for cells with the binding type script and user's lock
  const addressBindingCell = await client.findSingletonCellByType(
    addressBindingCellTypeScript,
    true
  );

  return addressBindingCell;
};

export type Passkey = {
  id: Base64URLString;
  publicKey: Uint8Array;
  webauthnUserID: Base64URLString;
  counter: number;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
};

/**
 * Human-readable title for your website
 */
export const rpName = "CKB DAO";
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
export const rpID = "localhost";
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
export const origin = `http://${rpID}`;

export const cacheRegistrationOptions = async (
  walletAddress: string,
  options: PublicKeyCredentialCreationOptionsJSON
) => {
  await writeCache(`registration_options:${walletAddress}`, options);
};

export const getRegistrationOptionsFromCache = async (
  walletAddress: string
): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const options = await readCache<PublicKeyCredentialCreationOptionsJSON>(
    `registration_options:${walletAddress}`
  );
  return options?.value as PublicKeyCredentialCreationOptionsJSON;
};

export const cachePasskey = async (walletAddress: string, passkey: Passkey) => {
  await writeCache(`passkey:${walletAddress}`, passkey);
};

export const getPasskeyFromCache = async (
  walletAddress: string
): Promise<Passkey> => {
  const passkey = await readCache<Passkey>(`passkey:${walletAddress}`);
  return passkey?.value as Passkey;
};
