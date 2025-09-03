export { assertVersion }
export { isVersionOrAbove }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { joinEnglish } from './joinEnglish.js'
assertIsNotBrowser()

type Version = `${number}.${number}.${number}`

function assertVersion(dependencyName: 'Vite' | 'Node.js', versionActual: string, versionExpected: Version[]) {
  assertUsage(
    isVersionOrAbove(versionActual, versionExpected),
    `${pc.bold(dependencyName)} ${pc.red(pc.bold(versionActual))} isn't supported, use ${pc.bold(dependencyName)} ${joinEnglish(
      [...versionExpected, 'above'].map((v) => pc.green(pc.bold(v))),
      'or',
    )}.`,
  )
}

function isVersionOrAbove(versionActual: string, versionExpected: Version[]): boolean {
  assert(versionActual)
  assert(versionExpected)
  assert(versionExpected.length > 0)

  const actualParts = parseVersion(versionActual)
  const actualMajor = actualParts[0]

  // Find all expected versions that have the same major version as actual
  const versionExpectedSameMajor = versionExpected.filter((version) => {
    const expectedParts = parseVersion(version)
    return expectedParts[0] === actualMajor
  })

  if (versionExpectedSameMajor.length > 0) {
    assert(versionExpectedSameMajor.length === 1)
    // If there are versions with the same major, check if actual satisfies any of them
    return versionExpectedSameMajor.every((version) => compare(versionActual, version))
  } else {
    // If no same major versions, check if actual satisfies any version with lower major
    return versionExpected.some((version) => {
      const expectedParts = parseVersion(version)
      return actualMajor > expectedParts[0]
    })
  }
}

function compare(versionActual: string, versionExpected: Version): boolean {
  const p1 = parseVersion(versionActual)
  const p2 = parseVersion(versionExpected)

  // major
  if (p1[0] !== p2[0]) return p1[0] > p2[0]
  // minor
  if (p1[1] !== p2[1]) return p1[1] > p2[1]
  // patch
  if (p1[2] !== p2[2]) return p1[2] > p2[2]

  // Same version
  return true
}

function parseVersion(version: string): [number, number, number] {
  // Remove pre-release tag
  version = version.split('-')[0]!

  let partsStr = version.split('.')

  // Git seems to be using a fourth number: https://github.com/git/git/tree/master/Documentation/RelNotes
  partsStr = partsStr.slice(0, 3)

  // major.minor.patch
  assert(partsStr.length === 3)
  assert(partsStr.every((s) => s.length > 0))

  const parts = partsStr.map((s) => parseInt(s, 10)) as [number, number, number]
  return parts
}
