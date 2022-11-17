Example of using `vite-plugin-ssr` with [Stem React](https://github.com/brillout/stem-react).

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/stem-react/
npm install
npm run dev
```

Note how the app doesn't have any `renderer/`: the renderer is provided by Stem React.

The renderer is ejectable: run `$ npx eject @brillout/stem-react` to eject it. (Or `pnpm execute eject @brillout/stem-react` / `yarn eject @brillout/stem-react`.)
