import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://145.223.18.56:8080",
    },
  },
  plugins: [react()],
});
