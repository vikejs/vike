export { isNpmPackageImport }
export { isNpmPackageImport_unreliable }
export { assertIsNpmPackageImport }
export { isValidPathAlias }
/* Currently not used
export { isNpmPackageName }
export { getNpmPackageName }
export { getNpmPackageImportPath }
*/

// For ./isNpmPackage.spec.ts
export { parse }
export { isDistinguishable }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function isNpmPackageImport(str: string, { cannotBePathAlias }: { cannotBePathAlias: true }): boolean {
  assert(cannotBePathAlias)
  return isNpmPackageImport_unreliable(str)
}
// We cannot distinguish path aliases that look like npm package imports
function isNpmPackageImport_unreliable(str: string): boolean {
  const res = parse(str)
  return res !== null
}
function assertIsNpmPackageImport(str: string): void {
  assert(
    isNpmPackageImport(str, {
      // If `str` is a path alias that looks like an npm package => assertIsNpmPackageImport() is erroneous but that's okay because the assertion will eventually fail for some other user using a disambiguated path alias.
      cannotBePathAlias: true
    }),
    str
  )
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
  // Cannot be distinguished from npm package names
  if (!isDistinguishable(alias)) return false

  // Ensure path alias starts with a special character.
  //  - In principle, we could allow path aliases that don't start with special character as long as they can be distinguished from npm package names.
  //    - But we still enforce path aliases to start with a special character because it's a much simpler rule to follow.
  if (alias.startsWith('@/')) return true // Needed by contra.com
  const firstLetter = alias[0]
  assert(firstLetter)
  if (firstLetter === '@' || /[0-9a-z]/.test(firstLetter.toLowerCase())) return false

  return true
}

function isDistinguishable(alias: string): boolean {
  return (
    parse(alias) === null &&
    parse(`${alias}fake-path`) === null &&
    parse(`${alias}/fake-path`) === null &&
    parse(`${alias}fake/deep/path`) === null &&
    parse(`${alias}/fake/deep/path`) === null &&
    // See note about '-' in ./isNpmPackageName.spec.ts
    // ```ts
    // expect(parse('-')).toBe(null) // actually wrong: https://www.npmjs.com/package/-
    // ```
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
