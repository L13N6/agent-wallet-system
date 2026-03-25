# 🦾 Agent Wallet System (EVM/Base/Solana)

A high-security, automated wallet management and decentralized finance (DeFi) integration framework for AI Agents (OpenClaw) on EVM-compatible chains (specifically Base Mainnet) and Solana.

## 🚀 Key Features

- **Encrypted Storage**: Secure handling of private keys and mnemonics using AES-256-GCM via `wallet-store.js`.
- **Multi-Chain Support**: Native support for EVM (Base, Ethereum, etc.) and Solana ecosystems.
- **Autonomous DeFi**: Built-in Uniswap V2-compatible swap engine for automated asset management.
- **Agent-Ready**: Optimized for CLI-based agent interactions and headless execution.

## 📁 Core Components

| File | Description |
| :--- | :--- |
| `wallet-store.js` | Advanced encryption layer for secure credential persistence. |
| `evm.js` | Core EVM logic: balance monitoring, transaction building, and RPC interactions. |
| `solana.js` | Transaction orchestration for the Solana network. |
| `uniswap-swap.js` | **(NEW)** Autonomous token swap module (USDC to ETH) optimized for Base Mainnet. |
| `generate.js` | Deterministic wallet generation utility. |

## 🛠 Setup & Usage

### 1. Environment Configuration
Create a `.env` file in the root directory (ensure this file is never committed):
```env
PRIVATE_KEY=your_encrypted_private_key
RPC_URL=https://mainnet.base.org
```

### 2. Autonomous Token Swapping
The `uniswap-swap.js` module enables agents to manage their own liquidity. It handles token approvals, quotes, and execution with built-in slippage protection.

```bash
# Execute a swap for 0.1 USDC (Default)
node uniswap-swap.js 0.1

# Execute swap for custom amount
node uniswap-swap.js [AMOUNT]
```

### 3. Wallet Generation
Provision a new agent identity with a single command:
```bash
node generate.js
```

## 🔒 Security Protocol

- **Zero-Leaked Keys**: Sensitive credentials must be stored in encrypted stores or environment variables only.
- **Base Optimization**: DeFi operations use optimized routing on Base Mainnet to ensure transaction reliability for small-to-medium agentic payloads.
- **Code Integrity**: Ensure `node_modules` are up-to-date with `npm install ethers dotenv`.

---
## ⚖️ License
This project is licensed under the [MIT License](LICENSE).
