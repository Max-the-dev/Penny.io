export const BASE_MAINNET_CAIP = 'eip155:8453';
export const BASE_SEPOLIA_CAIP = 'eip155:84532';
export const SOLANA_MAINNET_CAIP = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
export const SOLANA_DEVNET_CAIP = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

export const NETWORK_FALLBACK_ICONS: Record<string, string> = {
  [BASE_MAINNET_CAIP]: '/icons/base.png',
  [BASE_SEPOLIA_CAIP]: '/icons/base.png',
  [SOLANA_MAINNET_CAIP]: '/icons/solana.png',
  [SOLANA_DEVNET_CAIP]: '/icons/solana.png',
};

export const NETWORK_FAMILY_DEFAULTS: Record<'base' | 'solana', string> = {
  base: BASE_MAINNET_CAIP,
  solana: SOLANA_MAINNET_CAIP,
};
