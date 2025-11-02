/**
 * WebAuthn client service using SimpleWebAuthn
 * Handles credential creation and verification for secure address binding
 */

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from "@simplewebauthn/browser";

// Types for WebAuthn responses
export type RegistrationResponseJSON = any;
export type AuthenticationResponseJSON = any;

export interface WebAuthnCredentialData {
  credentialId: string;
  publicKey: string;
  counter: number;
  transports?: AuthenticatorTransport[];
  createdAt: number;
}

export class WebAuthnClient {
  /**
   * Check if WebAuthn is supported in the current browser
   */
  static isSupported(): boolean {
    return browserSupportsWebAuthn();
  }

  /**
   * Check if WebAuthn autofill is supported
   */
  static async isAutofillSupported(): Promise<boolean> {
    return await browserSupportsWebAuthnAutofill();
  }

  /**
   * Start registration (credential creation) flow
   */
  static async startRegistration(
    userId: string,
    userName: string,
    userDisplayName: string
  ): Promise<{
    registration: RegistrationResponseJSON;
    challenge: string;
  }> {
    if (!this.isSupported()) {
      throw new Error("WebAuthn is not supported in this browser");
    }

    // Get registration options from server
    console.log("Requesting registration options for:", {
      userId,
      userName,
      userDisplayName,
    });

    const response = await fetch("/api/binding-registration-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userName,
        userDisplayName,
      }),
    });

    console.log("Registration options response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Registration options error:", errorText);
      throw new Error(
        `Failed to get registration options: ${response.status} ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log("Registration options received:", responseData);

    const { options, challenge } = responseData;

    // Start the registration process
    console.log("Starting WebAuthn registration with options:", options);
    const registration = await startRegistration(options);

    return {
      registration,
      challenge,
    };
  }

  /**
   * Verify registration with server
   */
  static async verifyRegistration(
    registrationResponse: RegistrationResponseJSON,
    challenge: string,
    userId: string
  ): Promise<{
    verified: boolean;
    bindingToken?: string;
    credentialId?: string;
  }> {
    const response = await fetch("/api/binding-registration-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        registrationResponse,
        challenge,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify registration");
    }

    return await response.json();
  }

  /**
   * Start authentication flow
   */
  static async startAuthentication(userId: string): Promise<{
    authentication: AuthenticationResponseJSON;
    challenge: string;
  }> {
    if (!this.isSupported()) {
      throw new Error("WebAuthn is not supported in this browser");
    }

    // Get authentication options from server
    const response = await fetch("/api/binding-authentication-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get authentication options");
    }

    const { options, challenge } = await response.json();

    // Start the authentication process
    const authentication = await startAuthentication(options);

    return {
      authentication,
      challenge,
    };
  }

  /**
   * Verify authentication with server
   */
  static async verifyAuthentication(
    authentication: AuthenticationResponseJSON,
    challenge: string,
    userId: string
  ): Promise<{
    verified: boolean;
  }> {
    const response = await fetch("/api/binding-authentication-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authentication,
        challenge,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify authentication");
    }

    return await response.json();
  }

  /**
   * Store credential in local storage for caching
   */
  static storeCredential(credential: WebAuthnCredentialData): void {
    const stored = localStorage.getItem("ckb_dao_webauthn_credentials");
    const credentials = stored ? JSON.parse(stored) : [];
    credentials.push(credential);
    localStorage.setItem(
      "ckb_dao_webauthn_credentials",
      JSON.stringify(credentials)
    );
  }

  /**
   * Retrieve stored credentials from local storage
   */
  static getStoredCredentials(): WebAuthnCredentialData[] {
    const stored = localStorage.getItem("ckb_dao_webauthn_credentials");
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Clear stored credentials
   */
  static clearStoredCredentials(): void {
    localStorage.removeItem("ckb_dao_webauthn_credentials");
  }
}

/**
 * Helper class for binding flow orchestration
 */
export class AddressBindingFlow {
  private bindingToken: string | null = null;
  private credentialId: string | null = null;

  /**
   * Start the binding flow with WebAuthn registration
   */
  async startBinding(userId: string, userName: string): Promise<string> {
    // Step 1: Start WebAuthn registration
    const { registration, challenge } = await WebAuthnClient.startRegistration(
      userId,
      userName,
      userName
    );

    // Step 2: Verify registration with server
    const verificationResult = await WebAuthnClient.verifyRegistration(
      registration,
      challenge,
      userId
    );

    if (!verificationResult.verified) {
      throw new Error("Registration verification failed");
    }

    this.bindingToken = verificationResult.bindingToken || "";
    this.credentialId = verificationResult.credentialId || "";

    // Store binding token for wallet integration
    if (this.bindingToken) {
      await fetch("/api/binding-complete", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bindingToken: this.bindingToken,
        }),
      });
    }

    // Store credential locally
    if (this.credentialId) {
      WebAuthnClient.storeCredential({
        credentialId: this.credentialId,
        publicKey: "", // Will be populated from server
        counter: 0,
        createdAt: Date.now(),
      });
    }

    return this.bindingToken;
  }

  /**
   * Complete binding with wallet signature
   */
  async completeBinding(
    userId: string,
    walletAddress: string,
    signature: string,
    message?: string
  ): Promise<{ txHash: string; status: "pending" | "verified" }> {
    if (!this.bindingToken || !this.credentialId) {
      throw new Error(
        "Binding not started. Please start the binding flow first."
      );
    }

    // Call the backend API to create the on-chain transaction
    const response = await fetch("/api/binding-complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        bindingToken: this.bindingToken,
        walletAddress,
        signature,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to complete binding");
    }

    return await response.json();
  }

  /**
   * Check binding status
   */
  async checkStatus(walletAddress: string): Promise<{
    status: "none" | "pending" | "verified" | "revoked";
    credential?: WebAuthnCredentialData;
  }> {
    try {
      const response = await fetch(
        `/api/binding-status?address=${encodeURIComponent(walletAddress)}`
      );

      if (!response.ok) {
        throw new Error("Failed to check status");
      }

      const data = await response.json();

      if (data.success && data.status !== "none") {
        // Check local storage for credential data
        const stored = WebAuthnClient.getStoredCredentials();
        const credential = stored.find(
          (c) => data.bindingData?.credentialId === c.credentialId
        );

        return {
          status: data.status,
          credential,
        };
      }
    } catch (error) {
      console.error("Status check failed:", error);
    }

    // Fallback to local storage check
    const stored = WebAuthnClient.getStoredCredentials();
    if (stored.length > 0) {
      return {
        status: "verified",
        credential: stored[0],
      };
    }
    return { status: "none" };
  }

  /**
   * Revoke binding
   */
  async revokeBinding(walletAddress: string): Promise<boolean> {
    const response = await fetch("/api/binding-revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to revoke binding");
    }

    WebAuthnClient.clearStoredCredentials();
    return true;
  }
}

export default WebAuthnClient;
