import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  preview: {
    allowedHosts: [
      'tic-nnewi-v2.onrender.com',
      'tic-nnewi-v2.vercel.app'
    ],
    port: process.env.PORT || 4173,
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
