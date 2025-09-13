// Main barrel export file following CKBoost pattern

// Export address binding functionality
export * from "./address-binding/index.js";

// Export server components
export * from "./server/WebAuthnManager.js";
export * from "./server/handlers.js";
export * from "./server/jwt.js";

// Export client components
export * from "./client/WebAuthnClient.js";
export * from "./client/types.js";

// Export adapters
export * from "./adapters/netlify.js";

// Export types
export * from "./types.js";

// Export generated types under 'types' namespace
export * as types from "./generated/index.js";