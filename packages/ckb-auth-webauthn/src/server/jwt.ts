import jwt from 'jsonwebtoken';
import type { JWTPayload, RegistrationJWTPayload, AuthenticationJWTPayload } from '../types';

/**
 * Sign a JWT token with the given payload.
 * 
 * @param payload - The payload to sign.
 * @param secret - The secret key for signing.
 * @returns The signed JWT token.
 */
export function signJWT(payload: JWTPayload, secret: string): string {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
  });
}

/**
 * Verify and decode a JWT token.
 * 
 * @param token - The JWT token to verify.
 * @param secret - The secret key for verification.
 * @returns The decoded payload.
 * @throws Error if the token is invalid or expired.
 */
export function verifyJWT<T extends JWTPayload>(token: string, secret: string): T {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as T;
    
    // Additional validation
    if (!decoded.action || !decoded.userId || !decoded.challenge) {
      throw new Error('Invalid JWT payload structure');
    }
    
    // Check expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('JWT token has expired');
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('JWT token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid JWT token');
    }
    throw error;
  }
}

/**
 * Create a registration JWT payload.
 * 
 * @param userId - The user identifier.
 * @param challenge - The WebAuthn challenge.
 * @param rpId - The relying party ID.
 * @param expirySeconds - Token expiry in seconds (default 300).
 * @returns The registration JWT payload.
 */
export function createRegistrationPayload(
  userId: string,
  challenge: string,
  rpId: string,
  expirySeconds: number = 300
): RegistrationJWTPayload {
  return {
    userId,
    challenge,
    action: 'register',
    exp: Math.floor(Date.now() / 1000) + expirySeconds,
    rpId,
  };
}

/**
 * Create an authentication JWT payload.
 * 
 * @param userId - The user identifier.
 * @param challenge - The WebAuthn challenge.
 * @param rpId - The relying party ID.
 * @param credentialId - Optional credential ID for authentication.
 * @param expirySeconds - Token expiry in seconds (default 300).
 * @returns The authentication JWT payload.
 */
export function createAuthenticationPayload(
  userId: string,
  challenge: string,
  rpId: string,
  credentialId?: string,
  expirySeconds: number = 300
): AuthenticationJWTPayload {
  return {
    userId,
    challenge,
    action: 'authenticate',
    exp: Math.floor(Date.now() / 1000) + expirySeconds,
    rpId,
    credentialId,
  };
}

/**
 * Check if a JWT payload is for registration.
 * 
 * @param payload - The JWT payload to check.
 * @returns True if it's a registration payload.
 */
export function isRegistrationPayload(payload: JWTPayload): payload is RegistrationJWTPayload {
  return payload.action === 'register';
}

/**
 * Check if a JWT payload is for authentication.
 * 
 * @param payload - The JWT payload to check.
 * @returns True if it's an authentication payload.
 */
export function isAuthenticationPayload(payload: JWTPayload): payload is AuthenticationJWTPayload {
  return payload.action === 'authenticate';
}