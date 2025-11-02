import { deploymentManager } from "@/lib/ckb/deployment-manager";

export const getProtocolTypeScript = () => {
  const network = deploymentManager.getCurrentNetwork();
  const deployment = deploymentManager.getCurrentDeployment(
    network,
    "ckbdaoProtocolType"
  );

  if (!deployment || !deployment.typeHash) {
    throw new Error(
      `Protocol type contract not found in deployments.json for ${network}`
    );
  }

  // For protocol cells, we need to use the actual protocol contract code hash (typeHash)
  // not the Type ID script code hash
  const protocolTypeScript = {
    codeHash: deployment.typeHash,
    hashType: "type" as const,
    args: process.env.NEXT_PUBLIC_PROTOCOL_TYPE_ARGS || "0x", // Empty args to search for any protocol cell
  };

  return protocolTypeScript;
};
