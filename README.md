# 🦾 Agent Wallet System (EVM/Base/Solana)

A high-security, automated wallet management and decentralized finance (DeFi) integration framework for AI Agents (OpenClaw) on EVM-compatible chains (specifically Base Mainnet) and Solana.

## 🚀 Key Features

- **Encrypted Storage**: Secure handling of private keys and mnemonics using AES-256-GCM via `wallet-store.js`. **No .env required** if using the encrypted store.
- **Multi-Chain Support**: Native support for EVM (Base, Ethereum, etc.) and Solana ecosystems.
- **Autonomous DeFi**: Built-in Uniswap V2-compatible swap engine for automated asset management with **custom contract** support.
- **Agent-Ready**: Optimized for CLI-based agent interactions and headless execution.

## 📁 Core Components

| File | Description |
| :--- | :--- |
| `wallet-store.js` | Advanced encryption layer for secure credential persistence. |
| `evm.js` | Core EVM logic: balance monitoring, transaction building, and RPC interactions. |
| `solana.js` | Transaction orchestration for the Solana network. |
| `uniswap-swap.js` | **(NEW)** Autonomous token swap module with custom router and encrypted wallet support. |
| `generate.js` | Deterministic wallet generation utility. |

## 🛠 Setup & Usage

### 1. Security & Wallet Management
You can use a `.env` file (ensure it's in `.gitignore`) or use the **Encrypted Store** for maximum security.

**Encrypted Store Usage (Recommended):**
1. Generate/Save your wallet: `node generate.js` (or use `saveWallet` in `wallet-store.js`).
2. Pass the `walletName` and `password` to the swap function.

### 2. Autonomous Token Swapping
The `uniswap-swap.js` module handles token approvals, quotes, and execution with built-in slippage protection.

```bash
# Option 1: Using .env (Traditional)
node uniswap-swap.js 0.1

# Option 2: Using Encrypted Wallet Store (Secured)
node uniswap-swap.js [AMOUNT] [WALLET_NAME] [PASSWORD]
```

**Advanced Customization (SDK/Script):**
You can import the `swap` function and pass custom contract addresses (Router, TokenIn, TokenOut):
```javascript
const { swap } = require('./uniswap-swap');

swap({
  amountIn: '1.0',
  routerAddress: '0x...', // Custom V2 Router
  tokenIn: '0x...',       // Custom Token
  walletName: 'agent-1',
  password: 'your-secure-password'
});
```

### 3. Prerequisites
- Node.js 18+
- `npm install ethers dotenv`

---
## ⚖️ License
This project is licensed under the [MIT License](LICENSE).
