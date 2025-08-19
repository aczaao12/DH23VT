import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { // Thêm thuộc tính build ở đây
    sourcemap: true, // Và đặt sourcemap ở bên trong
  },
});