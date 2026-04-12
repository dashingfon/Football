# Setting Up Viem in Vanilla JS

This guide explains how to connect your Vanilla JS frontend to a smart contract using **Viem** directly, without needing React or Wagmi.

## 1. Installation

If you are using a bundler (like Vite, Webpack, or Parcel):

```bash
npm install viem
```

## 2. Configuration & Initialization

Viem separates operations into two primary clients:
1. **Public Client**: For reading from the blockchain (fetching data, contract state)
2. **Wallet Client**: For interacting with the user's wallet (transactions, signing)

Create a configuration file (e.g., `blockchain.js`) establishing these clients:

```javascript
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
```

## 3. Connecting the Wallet

With Vanilla JS, you interact directly with the `window.ethereum` object to request the user's accounts.

```javascript
import { walletClient } from './blockchain.js';

let userAddress = null;

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install a wallet like MetaMask!");
    return;
  }

  try {
    // Request permission to connect
    const [account] = await walletClient.requestAddresses();
    userAddress = account;
   
    console.log("Connected to address:", userAddress);
    // document.getElementById('wallet-status').innerText = \`Connected: \${userAddress}\`;
  } catch (error) {
    console.error("User rejected the request or an error occurred", error);
  }
}

// Example: Attach to a button
document.getElementById('connect-btn').addEventListener('click', connectWallet);
```

## 4. Reading Data from a Smart Contract

To read a public state variable or a `view` function from your smart contract, use the `publicClient.readContract` method.

```javascript
import { publicClient } from './blockchain.js';
import { yourContractAbi } from './abi.js';

const CONTRACT_ADDRESS = '0xYourContractAddressHere';

async function fetchNextOrderId() {
  try {
    const nextOrderId = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: yourContractAbi,
      functionName: 'nextOrderId',
    });

    console.log('Next Order ID:', Number(nextOrderId));
    // document.getElementById('order-info').innerText = \`Next Order ID: \${Number(nextOrderId)}\`;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data when the page loads or on button click
fetchNextOrderId();
```

## 5. Writing Data (Making Transactions)

To change the state of the blockchain (e.g., buying an item or creating an order), you must use the `walletClient` to propose the transaction, and the `publicClient` to wait for its confirmation.

```javascript
import { walletClient, publicClient } from './blockchain.js';
import { parseEther } from 'viem';
import { yourContractAbi } from './abi.js';

const CONTRACT_ADDRESS = '0xYourContractAddressHere';

async function handlePurchase() {
  if (!userAddress) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    // 1. Prompt the user wallet to sign and send the transaction
    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: yourContractAbi,
      functionName: 'createOrder',
      args: ['0xSellerAddressHere'],     // Pass required function arguments here
      value: parseEther('0.005'),        // Send MON/ETH if the function is payable
      account: userAddress,              // From the connected user
    });

    console.log("Transaction sent. Waiting for confirmation. Hash:", txHash);
    document.getElementById('buy-status').innerText = "Processing...";

    // 2. Wait for the transaction to be mined/confirmed on the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash
    });

    console.log("Transaction confirmed!", receipt);
    document.getElementById('buy-status').innerText = "Purchase Successful!";
   
    // You can parse event logs from the receipt here
    // console.log("Emitted Logs:", receipt.logs);

  } catch (error) {
    console.error("Transaction failed:", error);
    document.getElementById('buy-status').innerText = "Failed: " + error.message;
  }
}

document.getElementById('buy-btn').addEventListener('click', handlePurchase);
```

> [!TIP]
> Ensure your friend remembers to handle chain switching if their users are on the wrong network by checking `await walletClient.getChainId()` and using `walletClient.switchChain({ id: monadTestnet.id })`.


