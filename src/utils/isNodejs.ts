export { isNodejs }

function isNodejs() {
  /* We use `typeof windows` to support users using https://www.npmjs.com/package/ssr-window
  return typeof window === 'undefined'
  */
  return typeof process !== 'undefined' && typeof process.versions.node !== 'undefined'
}
