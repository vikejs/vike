Miscellaneous tests:
- Import path strings such as `import:./onRenderClient.jsx`. (See `/renderer/+config.h.ts`.)
- Side exports: being able to define a config as a "side export" in a `.md` file, such as frontmatter data. (See `export { frontmatter }` in `/pages/markdown-page/+Page.md`.)
- Route String defined over `+config.h.js > export default { route }` instead of `+route.js`. (See `/pages/markdown-page/+config.h.ts`.)
- Changing `build.outDir` using an unresolved path. (See `vite.config.ts`.)
- Defining meta over `+meta.js` instead of `+config.h.js > export default { meta }`. (See `/renderer/+meta.js`.)
- Pre-rendering `noExtraDir` option.
- Defining `config.clientRouting` over `+clientRouting.ts` instead of `+config.h.js > export default { clientRouting }`. (See `/renderer/+clientRouting.ts`.)
- Defining `config.passToClient` (a cumulative config) over an import file. (See `/renderer/passToClient.ts`.)
- TODO: Supports user direclty using `history.pushState()`.
