import { ccc } from "@ckb-ccc/core";
import { WebAuthnManager } from './WebAuthnManager';
import { AddressBinding } from '../address-binding';
import { 
  type AddressBindingDataLike,
} from '../generated';
import { BindingStatus } from '../types';
import type { 
  ServerConfig,
  HandlerRequest,
  HandlerResponse,
} from '../types';

/**
 * Create server handlers for WebAuthn operations.
 * 
 * @param config - Server configuration with WebAuthn and CKB settings.
 * @returns Object with handler functions for each endpoint.
 */
export function createHandlers(config: ServerConfig) {
  const manager = new WebAuthnManager(config);
  const client = new ccc.ClientPublicTestnet({ url: config.ckb.rpcUrl });
  
  let addressBinding: AddressBinding | null = null;
  if (config.ckb.addressBindingCodeOutPoint && config.ckb.addressBindingTypeScript) {
    addressBinding = new AddressBinding(
      config.ckb.addressBindingCodeOutPoint,
      config.ckb.addressBindingTypeScript,
      { client }
    );
  }

  return {
    /**
     * POST /api/webauthn/register/options
     * Generate registration options for a new credential.
     */
    async registrationOptions(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const { userId, userName } = req.body || {};
        
        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'User ID is required',
            }),
          };
        }

        // Check for existing bindings if addressBinding is configured
        let excludeCredentials: Array<{ id: string; type: 'public-key' }> = [];
        if (addressBinding) {
          const bindings = await addressBinding.queryBindings({ userId });
          excludeCredentials = bindings.map(b => ({
            id: ccc.hexFrom(b.webauthn_credential.credential_id),
            type: 'public-key' as const,
          }));
        }

        const result = await manager.generateRegistrationOptions(
          userId,
          userName,
          excludeCredentials
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            ...result,
          }),
        };
      } catch (error) {
        console.error('Registration options error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to generate registration options',
          }),
        };
      }
    },

    /**
     * POST /api/webauthn/register/verify
     * Verify registration and store binding on CKB.
     */
    async registrationVerify(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const { stateToken, response, walletAddress } = req.body || {};
        
        if (!stateToken || !response || !walletAddress) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'Missing required fields',
            }),
          };
        }

        // Verify the registration
        const verification = await manager.verifyRegistration(stateToken, response);
        
        if (!verification.verified || !verification.userId || !verification.credentialId || !verification.publicKey) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              verified: false,
              error: 'Registration verification failed',
            }),
          };
        }

        // Store binding on CKB if configured
        let txHash: string | undefined;
        
        if (addressBinding && config.ckb.privateKey) {
          const signer = new ccc.SignerCkbPrivateKey(client, config.ckb.privateKey);
          
          // Generate binding proof
          const bindingProof = manager.generateBindingProof(
            verification.userId,
            verification.credentialId,
            walletAddress
          );

          // Create binding data
          const bindingData: AddressBindingDataLike = {
            user_lock_hash: ccc.hashCkb(verification.userId),
            webauthn_credential: {
              credential_id: Buffer.from(verification.credentialId, 'base64url'),
              public_key: Buffer.from(verification.publicKey, 'base64url'),
              algorithm: -7, // ES256
              attestation_format: 'none',
              created_at: BigInt(Date.now()),
            },
            binding_proof: bindingProof,
            verified_at: BigInt(Date.now()),
            status: BindingStatus.VERIFIED,
            api_key_hash: null,
          };

          // Create and send transaction
          const tx = await addressBinding.storeBinding(signer, bindingData);
          await tx.completeFeeBy(signer);
          const hash = await signer.sendTransaction(tx);
          txHash = ccc.hexFrom(hash);
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            verified: true,
            credentialId: verification.credentialId,
            txHash,
          }),
        };
      } catch (error) {
        console.error('Registration verification error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to verify registration',
          }),
        };
      }
    },

    /**
     * POST /api/webauthn/auth/options
     * Generate authentication options.
     */
    async authenticationOptions(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const { userId, walletAddress } = req.body || {};
        
        if (!userId && !walletAddress) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'User ID or wallet address is required',
            }),
          };
        }

        // Get allowed credentials from CKB
        if (!addressBinding) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              error: 'Address binding not configured',
            }),
          };
        }

        const bindings = walletAddress
          ? [await addressBinding.getBinding(walletAddress)].filter(Boolean)
          : await addressBinding.queryBindings({ userId });

        if (bindings.length === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({
              success: false,
              error: 'No credentials found',
            }),
          };
        }

        const allowCredentials = bindings.map(b => ({
          id: ccc.hexFrom(b!.webauthn_credential.credential_id),
          type: 'public-key' as const,
        }));

        const result = await manager.generateAuthenticationOptions(
          userId || walletAddress,
          allowCredentials
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            ...result,
          }),
        };
      } catch (error) {
        console.error('Authentication options error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to generate authentication options',
          }),
        };
      }
    },

    /**
     * POST /api/webauthn/auth/verify
     * Verify authentication.
     */
    async authenticationVerify(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const { stateToken, response } = req.body || {};
        
        if (!stateToken || !response) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'Missing required fields',
            }),
          };
        }

        // Get the credential from CKB
        if (!addressBinding) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              error: 'Address binding not configured',
            }),
          };
        }

        // Find the credential by ID
        const credentialId = response.id;
        const bindings = await addressBinding.queryBindings({ credentialId });
        
        if (bindings.length === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({
              success: false,
              error: 'Credential not found',
            }),
          };
        }

        const binding = bindings[0];
        const publicKey = ccc.hexFrom(binding.webauthn_credential.public_key);
        
        // Verify the authentication
        const verification = await manager.verifyAuthentication(
          stateToken,
          response,
          publicKey,
          0 // Counter not tracked in our implementation
        );

        if (!verification.verified) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              verified: false,
              error: 'Authentication verification failed',
            }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            verified: true,
            userId: verification.userId,
          }),
        };
      } catch (error) {
        console.error('Authentication verification error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to verify authentication',
          }),
        };
      }
    },

    /**
     * GET /api/webauthn/status
     * Check binding status for a wallet address.
     */
    async status(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const walletAddress = req.query?.address;
        
        if (!walletAddress) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'Wallet address is required',
            }),
          };
        }

        if (!addressBinding) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              error: 'Address binding not configured',
            }),
          };
        }

        const binding = await addressBinding.getBinding(walletAddress);
        
        if (!binding) {
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              status: 'none',
              hasBinding: false,
            }),
          };
        }

        const statusMap: Record<number, string> = {
          [BindingStatus.PENDING]: 'pending',
          [BindingStatus.VERIFIED]: 'verified',
          [BindingStatus.REVOKED]: 'revoked',
        };

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            status: statusMap[Number(binding.status)] || 'unknown',
            hasBinding: true,
            credentialId: ccc.hexFrom(binding.webauthn_credential.credential_id),
            verifiedAt: binding.verified_at.toString(),
          }),
        };
      } catch (error) {
        console.error('Status check error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to check status',
          }),
        };
      }
    },

    /**
     * POST /api/webauthn/revoke
     * Revoke a binding.
     */
    async revoke(req: HandlerRequest): Promise<HandlerResponse> {
      try {
        const { walletAddress } = req.body || {};
        
        if (!walletAddress) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: 'Wallet address is required',
            }),
          };
        }

        if (!addressBinding || !config.ckb.privateKey) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              error: 'Address binding not configured',
            }),
          };
        }

        const signer = new ccc.SignerCkbPrivateKey(client, config.ckb.privateKey);
        const tx = await addressBinding.revokeBinding(signer, walletAddress);
        await tx.completeFeeBy(signer);
        const txHash = await signer.sendTransaction(tx);

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            txHash: ccc.hexFrom(txHash),
          }),
        };
      } catch (error) {
        console.error('Revoke error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: 'Failed to revoke binding',
          }),
        };
      }
    },
  };
}

export { WebAuthnManager } from './WebAuthnManager';