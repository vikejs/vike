export function isStemPackageName(npmPackageName: string): boolean {
  if (npmPackageName.startsWith('stem-')) {
    return true
  }
  const [orgName, pkgName] = npmPackageName.split('/')
  if (orgName!.startsWith('@') && pkgName?.startsWith('stem-')) {
    return true
  }
  return false
}
