Miscellaneous tests:
- Import path strings such as `import:./onRenderClient.jsx`. (See `/renderer/+config.ts`.)
- Side exports: being able to define a config as a "side export" in a `.md` file, such as frontmatter data. (See `export { frontmatter }` in `/pages/markdown-page/+Page.md`.)
- Route String defined over `+config.js > export default { route }` instead of `+route.js`. (See `/pages/markdown-page/+config.ts`.)
- ...
