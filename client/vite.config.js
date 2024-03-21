import { defineConfig } from 'vite';
import { createServer } from 'vite';
import historyApiFallback from 'connect-history-api-fallback';

export default defineConfig({
  // other configuration options
  server: {
    middleware: [
      historyApiFallback(), // Add this line to use connect-history-api-fallback
    ],
  },
});
