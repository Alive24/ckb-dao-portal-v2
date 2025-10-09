import type { Handler, HandlerResponse } from "@netlify/functions";
import {
  generateRegistrationOptions,
  type GenerateRegistrationOptionsOpts,
} from "@simplewebauthn/server";

interface RegistrationOptionsRequest {
  userId: string;
  userName: string;
  userDisplayName?: string;
}

type StoredCredential = {
  credentialID: string;
  transports?: string[];
};

declare global {
  // Shared in-memory storage so repeated invocations in dev can reuse data
  var __registrationOptionsCredentials:
    | Map<string, StoredCredential[]>
    | undefined;
  var __registrationChallenges: Map<string, string> | undefined;
}

const fnName = "binding/registration-options";
console.log(`⬥ Loaded function ${fnName}`);

const ensureStores = () => {
  if (!globalThis.__registrationOptionsCredentials) {
    globalThis.__registrationOptionsCredentials = new Map();
  }
  if (!globalThis.__registrationChallenges) {
    globalThis.__registrationChallenges = new Map();
  }
};

const respond = (
  statusCode: number,
  payload: Record<string, unknown>
): HandlerResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

export const handler: Handler = async (event) => {
  const reqId = Math.random().toString(36).slice(2, 8);
  const log = (...args: unknown[]) =>
    console.log(`[${fnName}][${reqId}]`, ...args);

  log("request", {
    method: event.httpMethod,
    path: event.path,
    query: event.rawQuery || event.queryStringParameters,
  });

  if (event.httpMethod !== "POST") {
    log("method_not_allowed");
    return respond(405, { success: false, error: "method_not_allowed" });
  }

  let body: RegistrationOptionsRequest;
  try {
    body = JSON.parse(event.body ?? "{}") as RegistrationOptionsRequest;
  } catch (error) {
    log("json_parse_error", { message: (error as Error)?.message });
    return respond(400, { success: false, error: "invalid_json" });
  }

  if (!body?.userId || !body?.userName) {
    log("validation_error", { body });
    return respond(400, {
      success: false,
      error: "missing_required_fields",
    });
  }

  ensureStores();
  const userCredentials = globalThis.__registrationOptionsCredentials!;
  const challengeStore = globalThis.__registrationChallenges!;
  const existingCredentials = userCredentials.get(body.userId) ?? [];
  const rpID =
    (event.headers?.host || "localhost").split(":")[0] || "localhost";
  const encoder = new TextEncoder();

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: "CKB DAO Portal",
    rpID,
    userID: encoder.encode(body.userId),
    userName: body.userName,
    userDisplayName: body.userDisplayName || body.userName,
    timeout: 60_000,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
    supportedAlgorithmIDs: [-7, -257],
  };

  try {
    const options = await generateRegistrationOptions(opts);
    challengeStore.set(body.userId, options.challenge);
    log("options_generated", {
      userId: body.userId,
      challenge: options.challenge,
      excludeCredentialsCount: existingCredentials.length,
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
