export function isNpmPackageName(str: string | undefined): boolean {
  if (!str || str.includes('.') || str.includes('\\')) {
    return false
  }
  if (!str.includes('/')) {
    return true
  }
  if (str.split('/').length === 2 && str.startsWith('@')) {
    return true
  }
  return false
}
