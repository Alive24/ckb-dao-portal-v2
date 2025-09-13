// Client-specific types for browser usage

export interface WebAuthnClientConfig {
  apiEndpoint: string;
  rpName?: string;
  rpId?: string;
}

export interface RegistrationResult {
  success: boolean;
  credentialId?: string;
  txHash?: string;
  error?: string;
}

export interface AuthenticationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface BindingStatusResult {
  success: boolean;
  status: 'none' | 'pending' | 'verified' | 'revoked';
  hasBinding: boolean;
  credentialId?: string;
  verifiedAt?: string;
  error?: string;
}

export interface RevokeResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// Re-export WebAuthn types from SimpleWebAuthn
export type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';