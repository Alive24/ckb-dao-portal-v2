import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import { createHandlers } from '../server/handlers';
import type { ServerConfig, HandlerRequest } from '../types';

/**
 * Create Netlify Functions handlers for WebAuthn operations.
 * 
 * @param config - Server configuration with WebAuthn and CKB settings.
 * @returns Object with Netlify Function handlers for each endpoint.
 * 
 * @example
 * ```typescript
 * // netlify/functions/registration-options.ts
 * import { createNetlifyHandlers } from '@ckb-auth/webauthn/adapters/netlify';
 * 
 * const handlers = createNetlifyHandlers({
 *   jwtSecret: process.env.JWT_SECRET!,
 *   rpName: 'CKB DAO Portal',
 *   rpId: process.env.DOMAIN || 'localhost:3000',
 *   ckb: {
 *     rpcUrl: process.env.CKB_RPC_URL!,
 *     privateKey: process.env.CKB_PRIVATE_KEY,
 *     addressBindingTypeScript: {
 *       codeHash: process.env.BINDING_TYPE_CODE_HASH!,
 *       hashType: 'type',
 *       args: '0x',
 *     },
 *     addressBindingCodeOutPoint: {
 *       txHash: process.env.BINDING_CODE_TX_HASH!,
 *       index: 0,
 *     },
 *   },
 * });
 * 
 * export const handler = handlers['registration-options'];
 * ```
 */
export function createNetlifyHandlers(config: ServerConfig) {
  const handlers = createHandlers(config);

  /**
   * Wrap a handler function for Netlify Functions.
   */
  const wrapHandler = (handlerFn: (req: HandlerRequest) => Promise<any>): Handler => {
    return async (event) => {
      try {
        // Parse request
        const req: HandlerRequest = {
          body: event.body ? JSON.parse(event.body) : undefined,
          query: Object.fromEntries(
            Object.entries(event.queryStringParameters || {}).filter(([_, v]) => v !== undefined) as [string, string][]
          ),
          headers: Object.fromEntries(
            Object.entries(event.headers || {}).filter(([_, v]) => v !== undefined) as [string, string][]
          ),
        };

        // Call handler
        const response = await handlerFn(req);

        // Add CORS headers
        return {
          statusCode: response.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            ...response.headers,
          },
          body: response.body,
        };
      } catch (error) {
        console.error('Netlify handler error:', error);
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        };
      }
    };
  };

  // Return wrapped handlers
  return {
    'registration-options': wrapHandler(handlers.registrationOptions),
    'registration-verify': wrapHandler(handlers.registrationVerify),
    'authentication-options': wrapHandler(handlers.authenticationOptions),
    'authentication-verify': wrapHandler(handlers.authenticationVerify),
    'status': wrapHandler(handlers.status),
    'revoke': wrapHandler(handlers.revoke),
  };
}

/**
 * Create a single Netlify Function handler based on the function name.
 * This is useful when you want to have separate function files for each endpoint.
 * 
 * @param functionName - The name of the function to create.
 * @param config - Server configuration.
 * @returns A Netlify Function handler.
 * 
 * @example
 * ```typescript
 * // netlify/functions/webauthn-registration-options.ts
 * import { createNetlifyHandler } from '@ckb-auth/webauthn/adapters/netlify';
 * 
 * export const handler = createNetlifyHandler('registration-options', {
 *   jwtSecret: process.env.JWT_SECRET!,
 *   rpName: 'CKB DAO Portal',
 *   rpId: process.env.DOMAIN || 'localhost:3000',
 *   ckb: {
 *     rpcUrl: process.env.CKB_RPC_URL!,
 *   },
 * });
 * ```
 */
export function createNetlifyHandler(
  functionName: keyof ReturnType<typeof createNetlifyHandlers>,
  config: ServerConfig
): Handler {
  const handlers = createNetlifyHandlers(config);
  return handlers[functionName];
}

/**
 * Middleware to handle OPTIONS requests for CORS preflight.
 * 
 * @returns A Netlify Function handler for OPTIONS requests.
 */
export const corsHandler: Handler = async () => {
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
    body: '',
  };
};

/**
 * Create a Netlify Function that handles both OPTIONS and the actual request.
 * 
 * @param functionName - The name of the function to create.
 * @param config - Server configuration.
 * @returns A Netlify Function handler with CORS support.
 */
export function createNetlifyHandlerWithCORS(
  functionName: keyof ReturnType<typeof createNetlifyHandlers>,
  config: ServerConfig
): Handler {
  const handler = createNetlifyHandler(functionName, config);
  
  return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      const result = await corsHandler(event, context);
      return result as HandlerResponse;
    }
    
    // Handle actual request
    const result = await handler(event, context);
    return result as HandlerResponse;
  };
}