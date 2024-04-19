import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import viteCompression from 'vite-plugin-compression';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        viteCompression({
          threshold: 10240,
          deleteOriginFile: false,
        }),
      ],
      output: {
        chunkFileNames: '[hash].js',
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.startsWith('swiper'),
        },
      },
    }),
    checker({
      vueTsc: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue'],
  },
});
