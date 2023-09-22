Example of using vike with [Stem React](https://github.com/brillout/stem-react).

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/stem-react/
npm install
npm run dev
```

Note how the user code doesn't have any `renderer/`: the renderer is provided by Stem React.

The renderer is ejectable: run `$ npx eject @brillout/stem-react` to eject it. (Or `pnpm execute eject @brillout/stem-react` / `yarn eject @brillout/stem-react`.)
