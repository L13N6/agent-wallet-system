# Agent Wallet System (EVM/Base/Solana)

A high-security, automated wallet management and decentralized finance (DeFi) integration framework for AI Agents on EVM-compatible chains (specifically Base Mainnet) and Solana.

## Key Features

- **Encrypted Storage**: Secure handling of private keys and mnemonics using AES-256-GCM via `wallet-store.js`. No `.env` required if using the encrypted store.
- **Multi-Chain Support**: Native support for EVM (Base, Ethereum, etc.) and Solana ecosystems.
- **Autonomous DeFi**: Built-in Uniswap V2-compatible swap engine for automated asset management with custom contract support.
- **Headless Architecture**: Optimized for CLI-based agent interactions and automated execution.

## Core Components

| File | Description |
| :--- | :--- |
| `wallet-store.js` | Advanced encryption layer for secure credential persistence. |
| `evm.js` | Core EVM logic: balance monitoring, transaction building, and RPC interactions. |
| `solana.js` | Transaction orchestration for the Solana network. |
| `uniswap-swap.js` | Autonomous token swap module with **multi-DEX (custom router)** and encrypted wallet support. |
| `generate.js` | Deterministic wallet generation utility. |

## Advanced Customization: Custom Contracts

The `uniswap-swap.js` module is designed to be extensible. You can override the default Base Mainnet Uniswap V2 router and token addresses to interact with any V2-compatible DEX on any EVM chain.

### Integration Example (JavaScript)
```javascript
const { swap } = require('./uniswap-swap');

async function runCustomSwap() {
  await swap({
    amountIn: '5.0',
    routerAddress: '0x...', // Target DEX Router (e.g., SushiSwap, PancakeSwap V2)
    tokenIn: '0x...',       // Source Token Address
    tokenOut: '0x...',      // Destination Token Address
    rpcUrl: 'https://...',  // Target Chain RPC
    walletName: 'agent-01',
    password: 'secure-vault-password'
  });
}
```

### Key Parameters
- `routerAddress`: The contract address of the Uniswap V2-compatible router.
- `tokenIn` / `tokenOut`: ERC20 token addresses for the swap pair.
- `rpcUrl`: The JSON-RPC endpoint for the target blockchain network.
- `slippageBps`: Slippage tolerance in basis points (e.g., `100` for 1%).

## Setup & Usage

### 1. Security & Wallet Management
The system supports both environment variables and an Encrypted Store for managing sensitive credentials.

**Encrypted Store Usage (Recommended):**
1. Generate/Save your wallet identity using the `generate.js` utility.
2. Access the wallet by providing the `walletName` and the decryption password.

### 2. Autonomous Token Swapping
The `uniswap-swap.js` module orchestrates token approvals, price quotes, and trade execution with configurable slippage protection.

```bash
# Method 1: Environment-based execution
node uniswap-swap.js 0.1

# Method 2: Encrypted Store-based execution (Secured)
node uniswap-swap.js [AMOUNT] [WALLET_NAME] [PASSWORD]
```

**Advanced Customization:**
The `swap` function can be imported into other scripts for custom DeFi workflows, allowing for specific router and token pair configurations.

```javascript
const { swap } = require('./uniswap-swap');

swap({
  amountIn: '1.0',
  routerAddress: '0x...', // Custom Router (V2 compatible)
  tokenIn: '0x...',       // Input Token Address
  tokenOut: '0x...',      // Output Token Address
  walletName: 'agent-1',
  password: 'decryption-password'
});
```

### 3. Prerequisites
- Node.js 18 or higher
- Dependencies: `ethers`, `dotenv`

## Security Protocol

- **Credential Integrity**: Private keys and mnemonics are never logged or stored in plaintext.
- **Transaction Reliability**: DeFi operations are optimized for Base Mainnet to ensure high success rates for automated payloads.
- **Permission Management**: It is recommended to use dedicated wallets with scoped permissions for automated agents.

---
## License
This project is licensed under the [MIT License](LICENSE).
