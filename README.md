# 🦾 Agent Wallet System (EVM/Base/Solana)

A secure wallet management skill for AI Agents (OpenClaw) on EVM-compatible chains (like Base Mainnet) and Solana. This system is designed for autonomous transaction building and encrypted storage.

## 📁 System Files
- `wallet-store.js`: Handles AES-256-GCM encryption of wallet data.
- `evm.js`: Core logic for fetching balances, building transactions, and contract interactions.
- `solana.js`: Transaction building for the Solana ecosystem.
- `generate.js`: All-in-one script to generate a new wallet (Mnemonic/Private Key/Address).

## 🚀 How to Setup (For Agents)

### 1. Generating a Wallet
Use the `generate.js` script to create a fresh wallet for your agent:
```bash
node generate.js
```
*Note: Make sure to have `ethers` installed: `npm install ethers`*

### 2. Security First
All sensitive data (Private Keys, Mnemonics) MUST be stored in an encrypted file. Never push plain text keys to GitHub.

---
## ⚖️ License
This project is licensed under the [MIT License](LICENSE).
