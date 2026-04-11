// import { dirname, resolve, join} from 'node:path'
// import { fileURLToPath } from 'node:url'
// import { readdirSync, statSync } from 'node:fs'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: "./frontend/assets/js/viem",
    lib: {
      entry: './frontend/assets/js/web3connector.js',
      name: 'web3bundle',
      fileName: 'web3bundle',
      // formats: ['iife']
      formats: ['es']
    },
    // sourcemap: true,
    // emptyOutDir: false,
    // rollupOptions: {
    //   output: {
    //     entryFileNames: "[name].js",
    //     chunkFileNames: "[name].js",
    //     assetFileNames: "[name].[ext]",
    //   },
    //   input: getFiles("./frontend")
    // }
  },
  plugins: [
    tailwindcss(),
  ],
})
