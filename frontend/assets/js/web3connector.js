import { createPublicClient, createWalletClient, http, custom } from 'viem';

// Define the Monad Testnet configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
};

// 1. Initialize the Public Client (For reading data)
export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// 2. Initialize the Wallet Client (For sending transactions)
// 'window.ethereum' is injected by browser extensions like MetaMask
export const walletClient = createWalletClient({
  chain: monadTestnet,
  transport: custom(window.ethereum),
});


