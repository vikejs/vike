export { moduleExists }

function moduleExists(modulePath: string): boolean {
  const req = require
  try {
    // `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
    req(modulePath)
    return true
  } catch (err) {
    const doesNotExist = err.code === 'MODULE_NOT_FOUND' && err.message.includes(`Cannot find module '${modulePath}'`)
    return !doesNotExist
  }
}
