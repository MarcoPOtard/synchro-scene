import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // expose sur le réseau local (accès depuis les téléphones des musiciens)
    // En dev, redirige le socket vers le serveur local : même comportement qu'en
    // production (client et socket sur la même origine), sans variable d'env.
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
