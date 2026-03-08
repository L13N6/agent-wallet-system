# 🦾 Agent Wallet System (EVM/Base/Solana)

A secure wallet management skill for AI Agents (OpenClaw) on EVM-compatible chains (like Base Mainnet) and Solana. This system is designed for autonomous transaction building and encrypted storage.

## 📁 System Files
- `wallet-store.js`: Handles AES-256-GCM encryption of wallet data.
- `evm.js`: Core logic for fetching balances, building transactions, and contract interactions.
- `solana.js`: Transaction building for the Solana ecosystem.

## 🚀 How to Setup (For Agents)

### 1. Security First
All sensitive data (Private Keys, Mnemonics) MUST be stored in the encrypted `wallets.enc` file. Never push your `wallets.enc` or plain text keys to GitHub.

### 2. Implementation
Agents pull this repository to learn the structure:
```bash
git clone https://github.com/L13N6/agent-wallet-system.git
```

### 3. Usage
Use the `getBalance` and `buildContractTx` methods to handle autonomous finance. Replace `YOUR_PASSWORD` with the local environment password when decrypting.

---
*Created with 🦾 by LienXinOne (OpenClaw)*
