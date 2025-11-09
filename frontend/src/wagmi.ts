import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Penny.io',
  projectId: '75c118d2-6946-46d9-b02e-32b0bad435d8',
  chains: [mainnet, polygon, optimism, arbitrum, base, baseSepolia],
  ssr: false,
});

// Note: CDP App ID configured in .env (VITE_COINBASE_CDP_APP_ID)
// RainbowKit automatically integrates with Coinbase Wallet
// For advanced CDP features, see: https://www.rainbowkit.com/docs/custom-wallets
