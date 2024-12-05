// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'account/login/index.html'),
        register: resolve(__dirname, 'account/register/index.html'),
        myaccount: resolve(__dirname, 'account/myaccount/index.html'),
        create: resolve(__dirname, 'listing/create/index.html'),
      },
    },
  },
});
