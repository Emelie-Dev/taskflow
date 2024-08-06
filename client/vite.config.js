import { defineConfig } from 'vite';
import { createServer } from 'vite';
import historyApiFallback from 'connect-history-api-fallback';

export default defineConfig({
  // other configuration options
  server: {
    middleware: [
      historyApiFallback(), // Add this line to use connect-history-api-fallback
    ],
    proxy: {
      '/api': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'https://taskflow-vuni.onrender.com'
            : 'http://localhost:2005',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
