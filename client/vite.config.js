import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: process.env.CODESPACE_NAME ? [`${process.env.CODESPACE_NAME}-5173.app.github.dev`] : [],
    proxy: { '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true } },
  },
})
