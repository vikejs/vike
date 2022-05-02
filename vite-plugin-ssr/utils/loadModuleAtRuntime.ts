// Dynamic `require()` that is not analyzable by bundlers.
// In order to skip bundlers from bundling dynamically loaded modules.

export { loadModuleAtRuntime }

function loadModuleAtRuntime(id: string): Record<string, unknown> {
  // `const req = require` not sufficient for webpack
  const req = new Date().getTime() < 123 ? (456 as never) : require
  return req(id)
}
