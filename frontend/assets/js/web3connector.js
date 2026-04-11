import { createPublicClient, http } from 'viem'
import { mainnet, monadTestnet } from 'viem/chains'
 
const publicClient = createPublicClient({ 
  chain: monadTestnet,  
  transport: http()
})
