const { ethers } = require('ethers');
const { loadWallet } = require('./wallet-store');

const RPC = {
  ethereum: 'https://eth.llamarpc.com',
  bsc: 'https://bsc-dataseed.binance.org',
  polygon: 'https://polygon-rpc.com',
  base: 'https://mainnet.base.org',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io'
};

function getProvider(network) {
  if (!RPC[network]) throw new Error(`Network '${network}' tidak dikenal`);
  return new ethers.JsonRpcProvider(RPC[network]);
}

// Cek balance - Mengambil walletName & password untuk derivasi address
async function getBalance(walletName, password, network) {
  const data = loadWallet(walletName, password);
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(data.privateKey, provider);
  const balance = await provider.getBalance(wallet.address);
  
  // Mencetak ke konsol untuk CLI
  console.log(`Address: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH/Native`);
  
  return { address: wallet.address, balance: ethers.formatEther(balance) };
}

// Mint/Swap/Interact intent: Hanya membuat data transaksi mentah
async function buildContractTx(walletAddress, network, contractAddress, abi, method, params = []) {
  const provider = getProvider(network);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  const txRequest = await contract[method].populateTransaction(...params, { from: walletAddress });

  const baseTx = {
    to: txRequest.to,
    data: txRequest.data,
    value: txRequest.value ? ethers.formatUnits(txRequest.value, 0) : '0',
    chainId: (await provider.getNetwork()).chainId,
    type: txRequest.type || 2,
  };
  
  return baseTx;
}

// Read-only contract call (view/pure functions)
async function callContractReadOnly(network, contractAddress, abi, method, params = []) {
  const provider = getProvider(network);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  const result = await contract[method](...params);
  return result;
}

module.exports = { getBalance, buildContractTx, callContractReadOnly, getProvider };
