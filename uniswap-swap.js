// uniswap-swap.js
const { ethers } = require('ethers');
const { loadWallet } = require('./wallet-store');
require('dotenv').config();

// ABI Minimal for Uniswap V2 Router
const ROUTER_ABI = [
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)'
];
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)'
];

// Config for Base Mainnet
const DEFAULT_ROUTER = '0x4752ba5DBc23f44D87826276Bf6Fd6b1C372aD24'.toLowerCase();
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase();
const WETH = '0x4200000000000000000000000000000000000006'.toLowerCase();

/**
 * Autonomous Swap from USDC to ETH
 * @param {Object} options Configuration options
 * @param {string} options.amountIn Amount of USDC to swap
 * @param {number} options.slippage Slippage in basis points (default 500 = 5%)
 * @param {string} options.walletName (Optional) Name of wallet in store
 * @param {string} options.password (Optional) Password for wallet store
 * @param {string} options.routerAddress (Optional) Custom router address
 * @param {string} options.tokenIn (Optional) Custom input token address
 */
async function swap(options = {}) {
  const {
    amountIn: amountInUsdc = '0.1',
    slippageBps = 500,
    walletName,
    password,
    routerAddress = DEFAULT_ROUTER,
    tokenIn: tokenInAddr = USDC,
    tokenOut: tokenOutAddr = WETH,
    rpcUrl = process.env.RPC_URL || 'https://mainnet.base.org'
  } = options;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  let privateKey = process.env.PRIVATE_KEY;

  // Use encrypted store if walletName and password are provided
  if (walletName && password) {
    console.log(`🔐 Loading wallet '${walletName}' from encrypted store...`);
    const walletData = loadWallet(walletName, password);
    privateKey = walletData.privateKey;
  }

  if (!privateKey) throw new Error('No private key provided (via .env or wallet-store)');

  const wallet = new ethers.Wallet(privateKey, provider);
  const router = new ethers.Contract(routerAddress, ROUTER_ABI, wallet);
  const tokenContract = new ethers.Contract(tokenInAddr, ERC20_ABI, wallet);

  // Decimals check (assumes 6 for USDC if address matches, else 18 default or fetch)
  const decimals = tokenInAddr === USDC ? 6 : 18;
  const amountIn = ethers.parseUnits(amountInUsdc.toString(), decimals);
  const path = [tokenInAddr, tokenOutAddr];

  console.log(`🔄 Checking Balance for ${wallet.address}...`);
  const balance = await tokenContract.balanceOf(wallet.address);
  if (balance < amountIn) throw new Error(`Insufficient balance. Have: ${ethers.formatUnits(balance, decimals)}`);

  console.log('📋 Checking Allowance...');
  const allowance = await tokenContract.allowance(wallet.address, routerAddress);
  if (allowance < amountIn) {
    console.log('🔓 Approving Token...');
    const tx = await tokenContract.approve(routerAddress, ethers.MaxUint256);
    await tx.wait();
    console.log('✅ Approved');
  }

  console.log('📈 Getting Quote...');
  const amounts = await router.getAmountsOut(amountIn, path);
  const amountOutMin = (amounts[path.length - 1] * BigInt(10000 - slippageBps)) / 10000n;
  console.log(`💰 Expected Output: ${ethers.formatEther(amounts[path.length - 1])} ETH`);

  console.log('🚀 Executing Swap...');
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  
  const tx = await router.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    wallet.address,
    deadline,
    { gasLimit: 300000 }
  );

  console.log(`📤 Tx Hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`🎉 Swap Success! Block: ${receipt.blockNumber}`);
  return tx.hash;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  // Simple CLI support: node uniswap-swap.js [amount] [walletName] [password]
  swap({
    amountIn: args[0],
    walletName: args[1],
    password: args[2]
  }).catch(console.error);
}

module.exports = { swap };
