/**
 * Quick helper to inspect a wallet's SPL USDC balance on Solana devnet.
 *
 * Usage:
 *   npx ts-node scripts/checkSolanaUsdcDevnet.ts <WALLET_ADDRESS> [MINT_ADDRESS]
 */

import { Connection, PublicKey } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';
// Circle devnet USDC mint (as of Nov 2025)
const DEFAULT_USDC_MINT = '7XSz9ELXEfC9FqFMFZHTEPMJbFsV5poJnzC4bqukctsz';

async function main() {
  const [addressArg, mintArg] = process.argv.slice(2);
  if (!addressArg) {
    console.error('Usage: ts-node scripts/checkSolanaUsdcDevnet.ts <WALLET_ADDRESS> [MINT]');
    process.exit(1);
  }

  try {
    const owner = new PublicKey(addressArg);
    const mint = new PublicKey(mintArg || DEFAULT_USDC_MINT);
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    console.log(`🔍 Checking USDC balance on devnet`);
    console.log(`   Wallet: ${owner.toBase58()}`);
    console.log(`   Mint:   ${mint.toBase58()}`);

    const accounts = await connection.getTokenAccountsByOwner(owner, { mint });
    if (!accounts.value.length) {
      console.log('⚠️  No token account found yet. The wallet may not have received devnet USDC.');
      return;
    }

    const balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey);
    console.log(`✅ Balance: ${balance.value.uiAmountString ?? '0'} USDC`);
  } catch (error) {
    console.error('❌ Failed to fetch balance:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
