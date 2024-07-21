// vite.config.ts
import react from "file:///home/dani/projects/vike/node_modules/.pnpm/@vitejs+plugin-react@4.3.1_vite@6.0.0-alpha.18_@types+node@20.13.0_terser@5.31.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { telefunc } from "file:///home/dani/projects/vike/node_modules/.pnpm/telefunc@0.1.73_@babel+core@7.24.6_@babel+parser@7.24.6_@babel+types@7.24.6_react-streaming@0_ky24ecjz3bhg35z3tsglqbwula/node_modules/telefunc/dist/cjs/node/vite/index.js";
import vike from "file:///home/dani/projects/vike/vike/dist/esm/node/plugin/index.js";
import vikeNode from "file:///home/dani/projects/vike/packages/vike-node/dist/plugin/index.js";
var vite_config_default = {
  plugins: [
    react(),
    vike(),
    vikeNode({
      server: { entry: "./server/index-express.ts", standalone: true }
    }),
    telefunc()
  ]
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kYW5pL3Byb2plY3RzL3Zpa2UvdGVzdC92aWtlLW5vZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RhbmkvcHJvamVjdHMvdmlrZS90ZXN0L3Zpa2Utbm9kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kYW5pL3Byb2plY3RzL3Zpa2UvdGVzdC92aWtlLW5vZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyB0ZWxlZnVuYyB9IGZyb20gJ3RlbGVmdW5jL3ZpdGUnXG5pbXBvcnQgdmlrZSBmcm9tICd2aWtlL3BsdWdpbidcbmltcG9ydCB2aWtlTm9kZSBmcm9tICd2aWtlLW5vZGUvcGx1Z2luJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpa2UoKSxcbiAgICB2aWtlTm9kZSh7XG4gICAgICBzZXJ2ZXI6IHsgZW50cnk6ICcuL3NlcnZlci9pbmRleC1leHByZXNzLnRzJywgc3RhbmRhbG9uZTogdHJ1ZSB9XG4gICAgfSksXG4gICAgdGVsZWZ1bmMoKVxuICBdXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLE9BQU8sV0FBVztBQUN6VCxTQUFTLGdCQUFnQjtBQUN6QixPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBRXJCLElBQU8sc0JBQVE7QUFBQSxFQUNiLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLFFBQVEsRUFBRSxPQUFPLDZCQUE2QixZQUFZLEtBQUs7QUFBQSxJQUNqRSxDQUFDO0FBQUEsSUFDRCxTQUFTO0FBQUEsRUFDWDtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
