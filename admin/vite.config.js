import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://192.168.29.121:8080",
    },
  },
  plugins: [react()],
});
