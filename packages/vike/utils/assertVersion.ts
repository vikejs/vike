export { assertVersion }
export { isVersionMatch }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { joinEnglish } from './joinEnglish.js'
assertIsNotBrowser()

type Version = `${number}.${number}.${number}`

function assertVersion(dependencyName: 'Vite' | 'Node.js', versionActual: string, versionExpectedList: Version[]) {
  assertUsage(
    isVersionMatch(versionActual, versionExpectedList),
    `${pc.bold(dependencyName)} ${pc.red(pc.bold(versionActual))} isn't supported, use ${pc.bold(dependencyName)} ${joinEnglish(
      [...versionExpectedList, 'above'].map((v) => pc.green(pc.bold(v))),
      'or',
    )}.`,
  )
}

function isVersionMatch(versionActual: string, versionExpectedList: Version[]): boolean {
  assert(versionActual)
  assert(versionExpectedList)
  assert(versionExpectedList.length > 0)

  const versionActualMajor = parseVersion(versionActual)[0]
  const versionExpectedListSameMajor = versionExpectedList.filter((versionExpected) => {
    const versionExpectedMajor = parseVersion(versionExpected)[0]
    return versionExpectedMajor === versionActualMajor
  })
  assert(versionExpectedListSameMajor.length <= 1)
  const versionExpectedSameMajor = versionExpectedListSameMajor[0]

  if (versionExpectedSameMajor) {
    return isSameOrAbove(versionActual, versionExpectedSameMajor)
  } else {
    return versionExpectedList.every((versionExpected) => isSameOrAbove(versionActual, versionExpected))
  }
}

function isSameOrAbove(versionActual: string, versionExpected: Version): boolean {
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
