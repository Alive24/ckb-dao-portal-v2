# CKB DAO Portal v2 - Development Setup

## Prerequisites

- Node.js 18+ and npm
- Rust 1.75+ and Cargo
- CKB development tools

## Project Structure

```
ckb-dao-portal-v2/
├── contracts/          # Rust smart contracts
│   ├── libs/          # Shared libraries
│   └── contracts/     # Individual contracts
├── dapp/              # Next.js frontend
├── docs/              # Documentation and transaction skeletons
└── schemas/           # Molecule schema definitions
```

## Installation

1. Clone the repository with submodules:
```bash
git clone --recursive https://github.com/ckb-dao-portal-v2
cd ckb-dao-portal-v2
```

2. Install dependencies:
```bash
npm run install:all
```

## Development

Run both contracts and frontend in development mode:
```bash
npm run dev
```

Or run individually:
```bash
npm run dev:contracts  # Watch and build contracts
npm run dev:dapp      # Run Next.js dev server
```

## Building

Build for production:
```bash
npm run build
```

## Testing

Run all tests:
```bash
npm run test
```

## Environment Variables

Create a `.env` file in the root directory:
```env
# Add your environment variables here
NEXT_PUBLIC_CKB_RPC_URL=https://testnet.ckb.dev
```

## Smart Contract Development

Contracts use the ckb_deterministic framework. To add a new contract:

1. Create a new directory in `contracts/contracts/`
2. Add it to the workspace in `contracts/Cargo.toml`
3. Implement using the shared library from `contracts/libs/dao-shared`

## Frontend Development

The frontend uses Next.js 14 with TypeScript and @ckb-ccc/connector-react for wallet integration.

Key directories:
- `dapp/app/` - App Router pages
- `dapp/components/` - React components
- `dapp/lib/` - Utilities and services