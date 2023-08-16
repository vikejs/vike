export { isNpmPackageImport }
export { isNpmPackageName }
export { getNpmPackageName }
export { getNpmPackageImportPath }
export { isValidPathAlias }

// For ./isNpmPackage.spec.ts
export { parse }

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function isNpmPackageImport(str: string): boolean {
  const res = parse(str)
  return res !== null
}

function isNpmPackageName(str: string | undefined): boolean {
  const res = parse(str)
  return res !== null && res.importPath === null
}

function getNpmPackageName(str: string): null | string {
  const res = parse(str)
  if (!res) return null
  return res.pkgName
}

function getNpmPackageImportPath(str: string): null | string {
  const res = parse(str)
  if (!res) return null
  return res.importPath
}

function isValidPathAlias(alias: string): boolean {
  return (
    parse(alias) === null &&
    parse(`${alias}fake-path`) === null &&
    parse(`${alias}/fake-path`) === null &&
    parse(`${alias}fake/deep/path`) === null &&
    parse(`${alias}/fake/deep/path`) === null &&
    !alias.startsWith('-')
  )
}

// The logic down below is wrong, for example:
//  - https://www.npmjs.com/package/-
// The correct logic is complex, see https://github.com/npm/validate-npm-package-name
// We don't need to be accurate: are there npm packages with weird names that are actually being used?
function parse(str: string | undefined): null | { pkgName: string; importPath: null | string } {
  if (!str) return null

  let scope: string | null = null
  if (str.startsWith('@')) {
    if (!str.includes('/')) return null
    const [scope_, ...rest] = str.split('/')
    scope = scope_!
    str = rest.join('/')
    if (!str) return null
    if (scope === '@' || invalid(scope.slice(1))) return null
  }

  const [name, ...importPathParts] = str.split('/')
  if (!name || invalid(name)) return null
  const importPath = importPathParts.length === 0 ? null : importPathParts.join('/')

  return {
    pkgName: scope ? `${scope}/${name}` : name,
    importPath
  }
}
function invalid(s: string) {
  const firstLetter = s[0]
  if (!firstLetter || !/[a-z0-9]/.test(firstLetter)) return true
  if (/[^a-z0-9_\-\.]/.test(s)) return true
  return false
}
