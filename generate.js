const { ethers } = require('ethers');

/**
 * 🦾 Agent Wallet Generator
 * Generates a new random Ethereum/EVM compatible wallet.
 * Includes Mnemonic (Seed Phrase), Private Key, and Address.
 */

function generateWallet() {
    console.log("[*] Generating new agent wallet...");
    
    // Create a random wallet
    const wallet = ethers.Wallet.createRandom();

    const result = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase
    };

    console.log("\n✅ NEW WALLET GENERATED");
    console.log("-----------------------------------------");
    console.log(`Address:    ${result.address}`);
    console.log(`Private Key: ${result.privateKey}`);
    console.log(`Mnemonic:    ${result.mnemonic}`);
    console.log("-----------------------------------------");
    console.log("⚠️  SAVE THESE DETAILS SECURELY!");
    console.log("⚠️  NEVER SHARE YOUR PRIVATE KEY OR MNEMONIC.");
    
    return result;
}

if (require.main === module) {
    generateWallet();
}

module.exports = { generateWallet };
