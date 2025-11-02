import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyAuthenticationResponseOpts,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { ccc } from "@ckb-ccc/core";
import {
  signJWT,
  verifyJWT,
  createRegistrationPayload,
  createAuthenticationPayload,
  isRegistrationPayload,
} from "./jwt";
import type {
  WebAuthnConfig,
  RegistrationResponse,
  AuthenticationResponse,
  VerificationResult,
} from "../types";

/**
 * WebAuthn manager for handling registration and authentication flows.
 * Uses JWT for stateless challenge management.
 */
export class WebAuthnManager {
  private config: Required<WebAuthnConfig>;

  constructor(config: WebAuthnConfig) {
    this.config = {
      ...config,
      tokenExpiry: config.tokenExpiry ?? 300, // Default 5 minutes
    };
  }

  /**
   * Generate registration options for a new WebAuthn credential.
   *
   * @param userId - The user identifier.
   * @param userName - Optional display name for the user.
   * @param excludeCredentials - Optional list of credentials to exclude.
   * @returns Registration options and a state token.
   */
  async generateRegistrationOptions(
    userId: string,
    userName?: string,
    excludeCredentials?: Array<{ id: string; type: "public-key" }>
  ): Promise<RegistrationResponse> {
    // Generate a random challenge
    const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
    const challenge = Buffer.from(challengeBytes).toString("base64url");

    // Generate WebAuthn registration options
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: this.config.rpName,
      rpID: this.config.rpId,
      userID: new TextEncoder().encode(userId),
      userName: userName || userId,
      userDisplayName: userName || userId,
      challenge,
      timeout: 60000, // 60 seconds
      attestationType: "none",
      excludeCredentials: excludeCredentials?.map((cred) => ({
        id: cred.id,
        type: "public-key" as const,
        transports: ["internal", "hybrid"] as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    };

    const options = await generateRegistrationOptions(opts);

    // Create JWT with challenge and user info
    const payload = createRegistrationPayload(
      userId,
      challenge,
      this.config.rpId,
      this.config.tokenExpiry
    );
    const stateToken = signJWT(payload, this.config.jwtSecret);

    return {
      options,
      stateToken,
    };
  }

  /**
   * Verify a registration response from the client.
   *
   * @param stateToken - The JWT state token from registration options.
   * @param response - The registration response from the client.
   * @returns Verification result with credential details.
   */
  async verifyRegistration(
    stateToken: string,
    response: any
  ): Promise<VerificationResult> {
    // Verify and decode the JWT
    const payload = verifyJWT(stateToken, this.config.jwtSecret);

    if (!isRegistrationPayload(payload)) {
      throw new Error("Invalid token: not a registration token");
    }

    // Set up verification options
    const expectedOrigin = this.config.rpId.startsWith("localhost")
      ? `http://localhost:${this.config.rpId.split(":")[1] || "3000"}`
      : `https://${this.config.rpId}`;

    const opts: VerifyRegistrationResponseOpts = {
      response,
      expectedChallenge: payload.challenge,
      expectedOrigin,
      expectedRPID: this.config.rpId,
      requireUserVerification: false,
    };

    // Verify the registration response
    const verification = await verifyRegistrationResponse(opts);

    if (!verification.verified || !verification.registrationInfo) {
      return { verified: false };
    }

    const regInfo = verification.registrationInfo;
    const credentialID = regInfo.credential.id;
    const credentialPublicKey = regInfo.credential.publicKey;
    const counter = regInfo.credential.counter;

    return {
      verified: true,
      userId: payload.userId,
      credentialId: Buffer.from(credentialID).toString("base64url"),
      publicKey: Buffer.from(credentialPublicKey).toString("base64url"),
      counter,
    };
  }

  /**
   * Generate authentication options for an existing credential.
   *
   * @param userId - The user identifier.
   * @param allowCredentials - List of allowed credentials for authentication.
   * @returns Authentication options and a state token.
   */
  async generateAuthenticationOptions(
    userId: string,
    allowCredentials: Array<{ id: string; type: "public-key" }>
  ): Promise<AuthenticationResponse> {
    // Generate a random challenge
    const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
    const challenge = Buffer.from(challengeBytes).toString("base64url");

    // Generate WebAuthn authentication options
    const opts: GenerateAuthenticationOptionsOpts = {
      rpID: this.config.rpId,
      challenge,
      timeout: 60000, // 60 seconds
      allowCredentials: allowCredentials.map((cred) => ({
        id: cred.id,
        type: "public-key" as const,
        transports: ["internal", "hybrid"] as AuthenticatorTransportFuture[],
      })),
      userVerification: "preferred",
    };

    const options = await generateAuthenticationOptions(opts);

    // Create JWT with challenge and user info
    const credentialId = allowCredentials[0]?.id;
    const payload = createAuthenticationPayload(
      userId,
      challenge,
      this.config.rpId,
      credentialId,
      this.config.tokenExpiry
    );
    const stateToken = signJWT(payload, this.config.jwtSecret);

    return {
      options,
      stateToken,
    };
  }

  /**
   * Verify an authentication response from the client.
   *
   * @param stateToken - The JWT state token from authentication options.
   * @param response - The authentication response from the client.
   * @param credentialPublicKey - The stored public key for the credential.
   * @param currentCounter - The current counter value for the credential.
   * @returns Verification result.
   */
  async verifyAuthentication(
    stateToken: string,
    response: any,
    credentialPublicKey: string,
    currentCounter: number
  ): Promise<VerificationResult> {
    // Verify and decode the JWT
    const payload = verifyJWT(stateToken, this.config.jwtSecret);

    if (payload.action !== "authenticate") {
      throw new Error("Invalid token: not an authentication token");
    }

    // Set up verification options
    const expectedOrigin = this.config.rpId.startsWith("localhost")
      ? `http://localhost:${this.config.rpId.split(":")[1] || "3000"}`
      : `https://${this.config.rpId}`;

    const opts: VerifyAuthenticationResponseOpts = {
      response,
      expectedChallenge: payload.challenge,
      expectedOrigin,
      expectedRPID: this.config.rpId,
      credential: {
        id: response.id,
        publicKey: new Uint8Array(
          ccc.bytesFrom(credentialPublicKey).buffer as ArrayBuffer
        ),
        counter: currentCounter,
      },
      requireUserVerification: false,
    };

    // Verify the authentication response
    const verification = await verifyAuthenticationResponse(opts);

    if (!verification.verified || !verification.authenticationInfo) {
      return { verified: false };
    }

    return {
      verified: true,
      userId: payload.userId,
      credentialId: response.id,
      counter: verification.authenticationInfo.newCounter,
    };
  }

  /**
   * Generate a secure binding proof for connecting WebAuthn to CKB address.
   *
   * @param userId - The user identifier.
   * @param credentialId - The WebAuthn credential ID.
   * @param walletAddress - The CKB wallet address.
   * @returns A cryptographic proof of the binding.
   */
  generateBindingProof(
    userId: string,
    credentialId: string,
    walletAddress: string
  ): Uint8Array {
    // Create a deterministic proof by hashing the components
    const message = `${userId}:${credentialId}:${walletAddress}:${Date.now()}`;
    const messageBytes = new TextEncoder().encode(message);

    // Use CKB's hash function for consistency
    const proof = ccc.hashCkb(messageBytes);
    return ccc.bytesFrom(proof);
  }

  /**
   * Validate configuration parameters.
   *
   * @throws Error if configuration is invalid.
   */
  validateConfig(): void {
    if (!this.config.jwtSecret || this.config.jwtSecret.length < 32) {
      throw new Error("JWT secret must be at least 32 characters");
    }

    if (!this.config.rpName) {
      throw new Error("Relying party name is required");
    }

    if (!this.config.rpId) {
      throw new Error("Relying party ID is required");
    }

    if (this.config.tokenExpiry < 60) {
      throw new Error("Token expiry must be at least 60 seconds");
    }
  }
}
