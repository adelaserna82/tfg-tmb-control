import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'TmbControl',
        short_name: 'TmbControl',
        description: 'Sistema de control de planta TMB',
        theme_color: '#1f2937',
        background_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/pwa-x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Agrega el alias para la carpeta src
    },
  },
})