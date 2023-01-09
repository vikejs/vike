Example of using VPS's V1 design.

This is work-in-progess and functionalities beyond this basic example isn't supported yet.

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/
git switch dev
pnpm install # Install whole monorepo
pnpm build # Build VPS
cd examples/v1/
pnpm run dev
```
