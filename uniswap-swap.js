// uniswap-swap.js
const { ethers } = require('ethers');
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
const ROUTER_ADDRESS = '0x4752ba5DBc23f44D87826276Bf6Fd6b1C372aD24'.toLowerCase();
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase();
const WETH = '0x4200000000000000000000000000000000000006'.toLowerCase();

async function swapUsdcToEth(amountInUsdc, slippageBps = 500) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://mainnet.base.org');
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) throw new Error('PRIVATE_KEY not found in .env');
  
  const wallet = new ethers.Wallet(privateKey, provider);
  const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, wallet);
  const usdcContract = new ethers.Contract(USDC, ERC20_ABI, wallet);

  const amountIn = ethers.parseUnits(amountInUsdc.toString(), 6);
  const path = [USDC, WETH];

  console.log(`🔄 Checking USDC Balance for ${wallet.address}...`);
  const balance = await usdcContract.balanceOf(wallet.address);
  if (balance < amountIn) throw new Error(`Insufficient USDC balance: ${ethers.formatUnits(balance, 6)}`);

  console.log('📋 Checking Allowance...');
  const allowance = await usdcContract.allowance(wallet.address, ROUTER_ADDRESS);
  if (allowance < amountIn) {
    console.log('🔓 Approving USDC...');
    const tx = await usdcContract.approve(ROUTER_ADDRESS, ethers.MaxUint256);
    await tx.wait();
    console.log('✅ Approved');
  }

  console.log('📈 Getting Quote...');
  const amounts = await router.getAmountsOut(amountIn, path);
  const amountOutMin = (amounts[1] * BigInt(10000 - slippageBps)) / 10000n;
  console.log(`💰 Expected ETH: ${ethers.formatEther(amounts[1])}`);

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
  const amount = process.argv[2] || '0.1';
  swapUsdcToEth(amount).catch(console.error);
}

module.exports = { swapUsdcToEth };
