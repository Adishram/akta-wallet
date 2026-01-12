import { Platform } from 'react-native';

export const walletConnectConfig = {
  // Replace with your WalletConnect Project ID from https://cloud.walletconnect.com
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  
  metadata: {
    name: 'CryptoWallet',
    description: 'Secure blockchain wallet for payments',
    url: 'https://cryptowallet.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  
  relayUrl: 'wss://relay.walletconnect.com',
  
  // Supported chains
  chains: [
    'eip155:1',     // Ethereum Mainnet
    'eip155:137',   // Polygon
    'eip155:56',    // BSC
    'eip155:42161', // Arbitrum
  ],
  
  // Mobile wallet links
  mobileWallets: [
    {
      id: 'metamask',
      name: 'MetaMask',
      links: {
        native: 'metamask://',
        universal: 'https://metamask.app.link',
      },
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      links: {
        native: 'trust://',
        universal: 'https://link.trustwallet.com',
      },
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      links: {
        native: 'rainbow://',
        universal: 'https://rainbow.me',
      },
    },
  ],
};

// Deep link scheme for callbacks
export const APP_SCHEME = 'cryptowallet';

// RPC endpoints for different networks
export const RPC_URLS: Record<number, string> = {
  1: 'https://eth.llamarpc.com',
  5: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
  11155111: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  137: 'https://polygon-rpc.com',
  56: 'https://bsc-dataseed.binance.org',
  42161: 'https://arb1.arbitrum.io/rpc',
};
