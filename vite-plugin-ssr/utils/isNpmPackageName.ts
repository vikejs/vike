export { isNpmPackageName }
export { isNpmPackageModule }
export { isNpmPackageImportPath }
export { getNpmPackageName }
export { getNpmPackageImportPath }

import { assert } from './assert'
const invalidNameRE = /[^a-zA-Z-_]/

function isNpmPackageModule(str: string): boolean {
  const res = parseNpmPath(str)
  return res !== null
}

function isNpmPackageName(str: string | undefined): boolean {
  const res = parseNpmPath(str)
  return res !== null && res.importPath === null
}

function isNpmPackageImportPath(str: string): boolean {
  const res = parseNpmPath(str)
  return res !== null && res.importPath !== null
}

function getNpmPackageName(str: string): null | string {
  const res = parseNpmPath(str)
  if (!res) return null
  return res.npmPackageName
}

function getNpmPackageImportPath(str: string): null | string {
  const res = parseNpmPath(str)
  if (!res) return null
  return res.importPath
}

function parseNpmPath(str: string | undefined): null | { npmPackageName: string; importPath: null | string } {
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
  const importPath = rest.length === 0 ? null : rest.join('/')
  assert(name)
  assert(importPath === null || !importPath.startsWith('/'))

  if (invalidNameRE.test(name) || (scope && invalidNameRE.test(scope.slice(1)))) {
    return null
  }

  assert(!name.startsWith('/'))
  const npmPackageName = scope ? `${scope}/${name}` : name

  return {
    npmPackageName,
    importPath
  }
}
