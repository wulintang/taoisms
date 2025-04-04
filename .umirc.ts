import { defineConfig } from "umi";

export default defineConfig({
  proxy: {
    '/api': {
      'target': process.env.API_URL || 'http://localhost:9091',
      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
    },
  },
  npmClient: 'pnpm',
});
