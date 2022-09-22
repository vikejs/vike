export function isBaseAssets(base: string) {
  if (base.startsWith('http')) {
    return true
  }
  return false
}
