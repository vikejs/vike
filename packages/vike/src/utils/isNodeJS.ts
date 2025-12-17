export function isNodeJS(): boolean {
  if (typeof process === 'undefined') return false
  if (!process.cwd) return false
  // https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js/35813135#35813135
  if (!process.versions || typeof process.versions.node === 'undefined') return false
  // https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js/35813135#comment92529277_35813135
  if (!process.release || process.release.name !== 'node') return false
  return true
}
