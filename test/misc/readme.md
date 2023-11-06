Miscellaneous tests:
- Import path strings `import:./onRenderClient.jsx`. (See `/pages/+config.h.ts`.)
- Side exports: being able to define a "side config" in a `.md` file such as frontmatter. (See title set by `export { frontend }` in `/pages/markdown-page/+Page.md`.)
- Route String defined over `+config.h.ts > export default { route }` instead of `+route.js`. (See `/pages/markdown-page/+config.h.ts`.)
