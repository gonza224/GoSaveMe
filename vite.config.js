import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.vue",     // if you use Vue
    "./resources/js/**/*.jsx",     // if you use React
    "./resources/js/**/*.tsx",     // if you use React + TS
  ],
  plugins: [laravel(['resources/js/app.tsx', 'resources/css/app.css']), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'), // or './src' if that's your structure
    },
  },
});
