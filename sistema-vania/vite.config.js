import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Para GitHub Pages en repo tipo usuario.github.io/repo-name usa: base: '/repo-name/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
