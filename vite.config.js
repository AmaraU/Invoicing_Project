import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/proapi': {
        target: 'https://41.78.157.215', // must match protocol (https if server supports it)
        changeOrigin: true,
        secure: false, // set to false if using self-signed SSL
        rewrite: (path) => path.replace(/^\/proapi/, ''),
      },
    },
  },

})