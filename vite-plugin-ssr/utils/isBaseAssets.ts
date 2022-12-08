export function isBaseAssets(base: string) { // TODO: move
  if (base.startsWith('http')) {
    return true
  }
  return false
}
