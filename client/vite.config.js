import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),],
    server: {
      port: 3000,  // Set the Vite port to 3000 (or another port of your choice)
      proxy: {
        // Proxy API requests to the backend server running on port 8000
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
})
