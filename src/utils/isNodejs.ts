export { isNodejs }

function isNodejs() {
  return typeof window === 'undefined'
}
