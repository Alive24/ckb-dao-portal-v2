# @ckb-auth/webauthn

WebAuthn authentication with CKB blockchain binding using ckb-ccc. A decoupled, reusable package for implementing secure WebAuthn-based address binding on CKB.

## Features

- 🔐 **Stateless WebAuthn**: JWT-based challenge management, no server storage needed
- ⛓️ **CKB Integration**: Store binding proofs on-chain using ckb-ccc and SSRI
- 🚀 **Production Ready**: Complete implementation with error handling and validation
- 🎯 **Platform Adapters**: Ready-to-use Netlify Functions adapter
- 📦 **TypeScript Support**: Full type definitions with JSDoc documentation
- 🔄 **Molecule Schema**: Uses CKB's Molecule for on-chain data encoding

## Installation

```bash
npm install @ckb-auth/webauthn
```

## Quick Start

### Server Setup (Netlify Functions)

```typescript
// netlify/functions/webauthn-registration-options.ts
import { createNetlifyHandler } from '@ckb-auth/webauthn/adapters/netlify';

export const handler = createNetlifyHandler('registration-options', {
  jwtSecret: process.env.JWT_SECRET!,
  rpName: 'CKB DAO Portal',
  rpId: process.env.DOMAIN || 'localhost:3000',
  ckb: {
    rpcUrl: process.env.CKB_RPC_URL!,
    privateKey: process.env.CKB_PRIVATE_KEY,
    addressBindingTypeScript: {
      codeHash: process.env.BINDING_TYPE_CODE_HASH!,
      hashType: 'type',
      args: '0x',
    },
    addressBindingCodeOutPoint: {
      txHash: process.env.BINDING_CODE_TX_HASH!,
      index: 0,
    },
  },
});
```

### Client Usage

```typescript
import { WebAuthnCKBClient } from '@ckb-auth/webauthn/client';

const client = new WebAuthnCKBClient({
  apiEndpoint: 'https://your-app.netlify.app',
});

// Register a new credential and bind to CKB address
async function bindAddress(walletAddress: string) {
  const result = await client.register(
    walletAddress, // userId
    walletAddress, // CKB address to bind
    'User Name'    // optional display name
  );
  
  if (result.success) {
    console.log('Binding stored on CKB:', result.txHash);
    console.log('Credential ID:', result.credentialId);
  }
}

// Authenticate with existing credential
async function authenticate(walletAddress: string) {
  const result = await client.authenticate(undefined, walletAddress);
  
  if (result.success) {
    console.log('Authentication successful');
  }
}

// Check binding status
async function checkStatus(walletAddress: string) {
  const status = await client.checkStatus(walletAddress);
  console.log('Binding status:', status.status); // 'none' | 'pending' | 'verified' | 'revoked'
}
```

## Architecture

### Package Structure

```
@ckb-auth/webauthn/
├── address-binding/    # CKB blockchain integration
├── server/            # Server-side WebAuthn logic
├── client/            # Browser client SDK
├── adapters/          # Platform adapters (Netlify, etc.)
└── types/             # TypeScript definitions
```

### Data Flow

1. **Registration Flow**:
   - Client requests registration options from server
   - Server generates challenge and stores in JWT
   - Client creates credential using WebAuthn API
   - Server verifies credential and stores binding on CKB
   - Returns transaction hash for on-chain verification

2. **Authentication Flow**:
   - Client requests authentication options
   - Server retrieves allowed credentials from CKB
   - Client authenticates using WebAuthn
   - Server verifies signature against stored public key

### On-Chain Storage

Address bindings are stored in CKB cells with:
- **Lock**: User's lock script (owner)
- **Type**: DAO address binding type script
- **Data**: AddressBindingData (Molecule encoded)

## API Reference

### Server Components

#### WebAuthnManager

Core WebAuthn logic with JWT state management:

```typescript
const manager = new WebAuthnManager({
  jwtSecret: 'your-secret-key',
  rpName: 'Your App',
  rpId: 'your-domain.com',
  tokenExpiry: 300, // seconds
});

// Generate registration options
const { options, stateToken } = await manager.generateRegistrationOptions(userId);

// Verify registration
const result = await manager.verifyRegistration(stateToken, response);
```

#### AddressBinding

CKB blockchain integration using SSRI:

```typescript
const binding = new AddressBinding(
  codeOutPoint,
  typeScript,
  { client }
);

// Store binding on-chain
const tx = await binding.storeBinding(signer, bindingData);

// Query binding
const data = await binding.getBinding(walletAddress);

// Revoke binding
const tx = await binding.revokeBinding(signer, walletAddress);
```

### Client Components

#### WebAuthnCKBClient

Browser-side client for complete WebAuthn flows:

```typescript
const client = new WebAuthnCKBClient({
  apiEndpoint: 'https://api.example.com'
});

// All methods return result objects with success/error
await client.register(userId, walletAddress);
await client.authenticate(userId);
await client.checkStatus(walletAddress);
await client.revokeBinding(walletAddress);
```

## Environment Variables

Required environment variables for server deployment:

```env
# WebAuthn Configuration
JWT_SECRET=your-jwt-secret-key-min-32-chars
DOMAIN=your-domain.com

# CKB Configuration
CKB_RPC_URL=https://testnet.ckb.dev
CKB_PRIVATE_KEY=0x... # Optional, for automatic transactions

# Address Binding Contract
BINDING_TYPE_CODE_HASH=0x...
BINDING_CODE_TX_HASH=0x...
```

## Security Considerations

1. **JWT Secret**: Use a strong, random secret of at least 32 characters
2. **HTTPS Only**: WebAuthn requires secure contexts (HTTPS or localhost)
3. **Challenge Expiry**: Challenges expire after 5 minutes by default
4. **No Storage**: This package doesn't store any data server-side
5. **User Ownership**: Binding cells are owned by user's lock script

## Development

```bash
# Install dependencies
npm install

# Generate types from Molecule schema
npm run generate

# Build package
npm run build

# Run tests
npm test
```

## Integration with DAO

This package is designed to work with the CKB DAO Portal. The address binding cells use the DAO's type script for validation and can be queried by other DAO contracts for authorization.

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.