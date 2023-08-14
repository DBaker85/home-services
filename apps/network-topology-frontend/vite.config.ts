import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react"],
          reactDom: ["react-dom"],
          redux: ["redux", "react-redux", "@reduxjs/toolkit"],
          tree: ["react-d3-tree"],
        },
      },
      // Configure the splitChunks plugin to split dependencies into smaller chunks
      maxParallelFileOps: 20,
    },
  },
});
