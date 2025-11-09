import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { base, baseSepolia, solana, solanaDevnet } from '@reown/appkit/networks';
import { wagmiConfig } from './wagmi';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const networks = [base, baseSepolia, solana, solanaDevnet];
const wagmiAdapter = new WagmiAdapter({ projectId, networks: [base, baseSepolia] });
const solanaAdapter = new SolanaAdapter({ networks: [solana, solanaDevnet] });

createAppKit({
  projectId,
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  metadata: {
    name: 'Penny.io',
    description: 'Multi-network payments',
    url: window.location.origin,
    icons: ['https://penny.io/icon.png'],
  },
});

export const appkitConfig = { wagmiAdapter };
