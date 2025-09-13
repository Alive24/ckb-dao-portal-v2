import { ccc } from "@ckb-ccc/core";

// Configuration types
export interface WebAuthnConfig {
  jwtSecret: string;
  rpName: string;
  rpId: string;
  tokenExpiry?: number; // seconds, default 300 (5 minutes)
}

export interface CKBConfig {
  rpcUrl: string;
  privateKey?: string;
  addressBindingTypeScript?: ccc.ScriptLike;
  addressBindingCodeOutPoint?: ccc.OutPointLike;
}

export interface ServerConfig extends WebAuthnConfig {
  ckb: CKBConfig;
}

// WebAuthn response types
export interface RegistrationResponse {
  options: any; // PublicKeyCredentialCreationOptions
  stateToken: string;
}

export interface AuthenticationResponse {
  options: any; // PublicKeyCredentialRequestOptions
  stateToken: string;
}

export interface VerificationResult {
  verified: boolean;
  userId?: string;
  credentialId?: string;
  publicKey?: string;
  counter?: number;
}

// Binding types
export enum BindingStatus {
  NONE = -1,
  PENDING = 0,
  VERIFIED = 1,
  REVOKED = 2,
}

export interface BindingResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface BindingQuery {
  walletAddress?: string;
  userId?: string;
  credentialId?: string;
  status?: number;
  userLockHash?: string;
  limit?: number;
}

// JWT payload types
export interface RegistrationJWTPayload {
  userId: string;
  challenge: string;
  action: 'register';
  exp: number;
  rpId?: string;
}

export interface AuthenticationJWTPayload {
  userId: string;
  challenge: string;
  credentialId?: string;
  action: 'authenticate';
  exp: number;
  rpId?: string;
}

export type JWTPayload = RegistrationJWTPayload | AuthenticationJWTPayload;

// Handler types
export interface HandlerRequest {
  body?: any;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface HandlerResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

// Error types
export class WebAuthnError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'WebAuthnError';
  }
}

export class CKBError extends Error {
  constructor(
    message: string,
    public code: string,
    public txHash?: string
  ) {
    super(message);
    this.name = 'CKBError';
  }
}

// Utility type for flexible input
export type Awaitable<T> = T | Promise<T>;