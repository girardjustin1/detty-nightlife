/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // GitHub Pages serves the site from /<repo>/; set VITE_BASE in CI.
  base: process.env.VITE_BASE ?? '/',
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
})
