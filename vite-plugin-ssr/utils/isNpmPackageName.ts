export { isNpmPackageName }
export { isNpmPackageModulePath }
export { getNpmPackageName }

import { assert } from './assert'
const invalidNameRE = /[^a-zA-Z-_]/

function isNpmPackageName(str: string | undefined): boolean {
  const res = parseNpmPackageModulePath(str)
  return res !== null && res.modulePath === null
}

function isNpmPackageModulePath(str: string): boolean {
  const res = parseNpmPackageModulePath(str)
  return res !== null
}

function getNpmPackageName(str: string): null | string {
  const res = parseNpmPackageModulePath(str)
  if (!res) return null
  return res.npmPackageName
}

function parseNpmPackageModulePath( // TODO: rename to `parseNpmPath()`
  str: string | undefined
): null | { npmPackageName: string; modulePath: null | string } {
  if (str === undefined || str.includes('\\') || str.startsWith('/')) {
    return null
  }

  let scope: string | null = null
  if (str.startsWith('@')) {
    if (!str.includes('/')) {
      return null
    }
    const [first, ...rest] = str.split('/')
    scope = first!
    str = rest.join('/')
    assert(scope && scope.startsWith('@'))
  }

  if (str === '') {
    return null
  }

  const [first, ...rest] = str.split('/')
  const name = first
  const path = rest.length === 0 ? null : rest.join('/')
  assert(name)

  if (invalidNameRE.test(name) || (scope && invalidNameRE.test(scope.slice(1)))) {
    return null
  }

  const npmPackageName = scope ? `${scope}/${name}` : name

  return {
    npmPackageName,
    modulePath: path
  }
}
