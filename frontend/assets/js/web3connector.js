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
  } catch (error) {
    console.error("User rejected the request or an error occurred", error);
  }
}

// Example: Attach to a button
document.getElementById('connect-btn').addEventListener('click', connectWallet);


// Reading Data

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
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data when the page loads or on button click
fetchNextOrderId();

// writing Data

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

