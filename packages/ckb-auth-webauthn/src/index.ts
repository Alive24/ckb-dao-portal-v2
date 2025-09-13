// Main entry point for @ckb-auth/webauthn package

export * from "./barrel.js";
export * as webauthn from "./barrel.js";

// Convenience default exports
export { WebAuthnCKBClient as default } from "./client/WebAuthnClient.js";
export { AddressBinding } from "./address-binding/index.js";
export { WebAuthnManager } from "./server/WebAuthnManager.js";
export { createNetlifyHandlers } from "./adapters/netlify.js";