const solanaWeb3 = require('./node_modules/@solana/web3.js');
const bs58 = require('./node_modules/bs58');
const { loadWallet } = require('./wallet-store');

const RPC = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com'
};

function getConnection(network = 'mainnet') {
  if (!RPC[network]) throw new Error(`Network '${network}' tidak dikenal. Gunakan: mainnet/devnet/testnet`);
  return new solanaWeb3.Connection(RPC[network], 'confirmed');
}

function getKeypair(walletName, password) {
  const data = loadWallet(walletName, password);
  const pk = data.privateKey;
  if (pk.startsWith('[')) {
    const arr = JSON.parse(pk);
    return solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(arr));
  }
  // Support bs58 versi lama dan baru
  const decoder = bs58.default ? bs58.default : bs58;
  return solanaWeb3.Keypair.fromSecretKey(decoder.decode(pk));
}

async function getBalance(walletName, password, network = 'mainnet') {
  const connection = getConnection(network);
  const keypair = getKeypair(walletName, password);
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`Address: ${keypair.publicKey.toString()}`);
  console.log(`Balance: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
  return {
    address: keypair.publicKey.toString(),
    balance: balance / solanaWeb3.LAMPORTS_PER_SOL
  };
}

async function transfer(walletName, password, toAddress, amount, network = 'mainnet') {
  const connection = getConnection(network);
  const keypair = getKeypair(walletName, password);
  const toPubkey = new solanaWeb3.PublicKey(toAddress);
  const tx = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey,
      lamports: amount * solanaWeb3.LAMPORTS_PER_SOL
    })
  );
  const sig = await solanaWeb3.sendAndConfirmTransaction(connection, tx, [keypair]);
  console.log(`TX Signature: ${sig}`);
  return sig;
}

async function transferToken(walletName, password, tokenMint, toAddress, amount, network = 'mainnet') {
  console.log('SPL token transfer - membutuhkan @solana/spl-token');
  console.log(`From wallet: ${walletName}`);
  console.log(`Token: ${tokenMint}`);
  console.log(`To: ${toAddress}, Amount: ${amount}`);
}

module.exports = { getBalance, transfer, transferToken, getConnection, getKeypair };
