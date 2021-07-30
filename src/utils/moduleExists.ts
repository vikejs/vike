export { moduleExists }

function moduleExists(modulePath: string): boolean {
  // `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
  const req = require
  try {
    req.resolve(modulePath)
    return true
  } catch (err) {
    const doesNotExist = err.code === 'MODULE_NOT_FOUND' && err.message.includes(`Cannot find module '${modulePath}'`)
    return !doesNotExist
  }
}
