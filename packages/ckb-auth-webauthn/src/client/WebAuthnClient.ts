import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';
import type {
  WebAuthnClientConfig,
  RegistrationResult,
  AuthenticationResult,
  BindingStatusResult,
  RevokeResult,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from './types';

/**
 * Client-side WebAuthn manager for browser usage.
 * Handles WebAuthn registration and authentication flows with CKB binding.
 */
export class WebAuthnCKBClient {
  private config: WebAuthnClientConfig;

  constructor(config: WebAuthnClientConfig) {
    this.config = config;
  }

  /**
   * Check if WebAuthn is supported in the current browser.
   * 
   * @returns True if WebAuthn is supported.
   */
  static isSupported(): boolean {
    return browserSupportsWebAuthn();
  }

  /**
   * Check if WebAuthn autofill is supported.
   * 
   * @returns Promise resolving to true if autofill is supported.
   */
  static async isAutofillSupported(): Promise<boolean> {
    return await browserSupportsWebAuthnAutofill();
  }

  /**
   * Complete registration flow for a new WebAuthn credential.
   * 
   * @param userId - The user identifier.
   * @param walletAddress - The CKB wallet address to bind.
   * @param userName - Optional display name for the user.
   * @returns Registration result with credential ID and transaction hash.
   */
  async register(
    userId: string,
    walletAddress: string,
    userName?: string
  ): Promise<RegistrationResult> {
    try {
      if (!WebAuthnCKBClient.isSupported()) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Step 1: Get registration options from server
      const optionsResponse = await fetch(`${this.config.apiEndpoint}/api/webauthn/register/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
        }),
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Failed to get registration options');
      }

      const { options, stateToken } = await optionsResponse.json();

      // Step 2: Create credential using browser WebAuthn API
      const credential = await startRegistration({ optionsJSON: options as PublicKeyCredentialCreationOptionsJSON });

      // Step 3: Verify registration and store on CKB
      const verifyResponse = await fetch(`${this.config.apiEndpoint}/api/webauthn/register/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stateToken,
          response: credential,
          walletAddress,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Failed to verify registration');
      }

      const result = await verifyResponse.json();

      return {
        success: result.verified === true,
        credentialId: result.credentialId,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  /**
   * Authenticate with an existing WebAuthn credential.
   * 
   * @param userId - The user identifier (optional if using walletAddress).
   * @param walletAddress - The wallet address (optional if using userId).
   * @returns Authentication result.
   */
  async authenticate(
    userId?: string,
    walletAddress?: string
  ): Promise<AuthenticationResult> {
    try {
      if (!WebAuthnCKBClient.isSupported()) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      if (!userId && !walletAddress) {
        throw new Error('Either userId or walletAddress is required');
      }

      // Step 1: Get authentication options from server
      const optionsResponse = await fetch(`${this.config.apiEndpoint}/api/webauthn/auth/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          walletAddress,
        }),
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Failed to get authentication options');
      }

      const { options, stateToken } = await optionsResponse.json();

      // Step 2: Authenticate using browser WebAuthn API
      const credential = await startAuthentication({ optionsJSON: options as PublicKeyCredentialRequestOptionsJSON });

      // Step 3: Verify authentication
      const verifyResponse = await fetch(`${this.config.apiEndpoint}/api/webauthn/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stateToken,
          response: credential,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Failed to verify authentication');
      }

      const result = await verifyResponse.json();

      return {
        success: result.verified === true,
        userId: result.userId,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  /**
   * Check the binding status for a wallet address.
   * 
   * @param walletAddress - The CKB wallet address to check.
   * @returns Binding status information.
   */
  async checkStatus(walletAddress: string): Promise<BindingStatusResult> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/api/webauthn/status?address=${encodeURIComponent(walletAddress)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check status');
      }

      const result = await response.json();

      return {
        success: true,
        status: result.status || 'none',
        hasBinding: result.hasBinding || false,
        credentialId: result.credentialId,
        verifiedAt: result.verifiedAt,
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        status: 'none',
        hasBinding: false,
        error: error instanceof Error ? error.message : 'Status check failed',
      };
    }
  }

  /**
   * Revoke an existing binding.
   * 
   * @param walletAddress - The wallet address of the binding to revoke.
   * @returns Revoke result with transaction hash.
   */
  async revokeBinding(walletAddress: string): Promise<RevokeResult> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/api/webauthn/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to revoke binding');
      }

      const result = await response.json();

      return {
        success: true,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('Revoke error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Revoke failed',
      };
    }
  }

  /**
   * Store credential data in local storage for caching.
   * This is optional and can be used to improve UX.
   * 
   * @param credentialId - The credential ID to store.
   * @param walletAddress - The associated wallet address.
   */
  storeCredentialLocally(credentialId: string, walletAddress: string): void {
    try {
      const stored = localStorage.getItem('ckb_webauthn_credentials');
      const credentials = stored ? JSON.parse(stored) : {};
      
      credentials[walletAddress] = {
        credentialId,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('ckb_webauthn_credentials', JSON.stringify(credentials));
    } catch (error) {
      console.error('Failed to store credential locally:', error);
    }
  }

  /**
   * Get stored credential from local storage.
   * 
   * @param walletAddress - The wallet address to look up.
   * @returns The stored credential ID if found.
   */
  getStoredCredential(walletAddress: string): string | null {
    try {
      const stored = localStorage.getItem('ckb_webauthn_credentials');
      if (!stored) return null;
      
      const credentials = JSON.parse(stored);
      return credentials[walletAddress]?.credentialId || null;
    } catch (error) {
      console.error('Failed to get stored credential:', error);
      return null;
    }
  }

  /**
   * Clear all stored credentials from local storage.
   */
  clearStoredCredentials(): void {
    try {
      localStorage.removeItem('ckb_webauthn_credentials');
    } catch (error) {
      console.error('Failed to clear stored credentials:', error);
    }
  }
}

// Export a default instance for convenience
export default WebAuthnCKBClient;