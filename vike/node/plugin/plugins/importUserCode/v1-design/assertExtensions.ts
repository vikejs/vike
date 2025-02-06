export { assertExtensionsConventions }
export { assertExtensionsRequire }

import pc from '@brillout/picocolors'
import { isObjectOfStrings } from '../../../../../utils/isObjectOfStrings.js'
import { PROJECT_VERSION, assert, assertUsage, assertWarning, findPackageJson } from '../../../utils.js'
import { getConfVal } from './getVikeConfig.js'
import type { PlusFile } from './getVikeConfig/getPlusFilesAll.js'
import path from 'path'
import semver from 'semver'
import { PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig.js'

function assertExtensionsConventions(plusFile: PlusFile): void {
  assertExtensionName(plusFile)
  assertConfigExportPath(plusFile)
}
function assertConfigExportPath(plusFile: PlusFile): void {
  const { importPathAbsolute, filePathAbsoluteFilesystem } = plusFile.filePath

  // Ejected Vike extension
  if (!importPathAbsolute) {
    const p = filePathAbsoluteFilesystem
    assert(!p.includes('node_modules'))
    return
  }

  const name = getNameValue(plusFile)
  assert(name) // already asserted in assertExtensionName()
  const importPathAbsoluteExpected = `${name}/config`
  assertWarning(
    importPathAbsolute === importPathAbsoluteExpected,
    `The Vike configuration of ${pc.bold(name)} is exported at ${pc.bold(
      importPathAbsolute
    )}, but it should be exported at ${pc.bold(importPathAbsoluteExpected)} instead.`,
    { onlyOnce: true }
  )
}
function assertExtensionName(plusFile: PlusFile): void {
  const filePathToShowToUser = getFilePathToShowToUser(plusFile)
  const name = getNameValue(plusFile)
  assertUsage(
    name,
    `Vike extension name missing: the config ${filePathToShowToUser} must define the setting ${pc.cyan('name')}`
  )
}

function assertExtensionsRequire(pageConfig: PageConfigBuildTime): void {
  const plusFilesRelevantList = Object.values(pageConfig.plusFiles).flat(1)

  // Collect extensions
  const extensions: Record<string, string> = {}
  plusFilesRelevantList.forEach((plusFile) => {
    const name = getNameValue(plusFile)
    if (name) {
      const version = getExtensionVersion(name, plusFile)
      extensions[name] = version
    }
  })

  // Enforce `require`
  plusFilesRelevantList.forEach((plusFile) => {
    const require = getConfigRequireValue(plusFile)
    if (!require) return
    const name = getNameValue(plusFile)
    const filePathToShowToUser = getFilePathToShowToUser(plusFile)
    assertUsage(
      name,
      `Setting ${pc.bold('name')} is required for being able to use setting ${pc.bold(
        'require'
      )} in ${filePathToShowToUser}.`
    )
    Object.entries(require).forEach(([reqName, reqVersion]) => {
      const errBase = `${pc.bold(name)} requires ${pc.bold(reqName)}`
      if (reqName === 'vike') {
        assertUsage(
          isVersionRange(PROJECT_VERSION, reqVersion),
          `${errBase} version ${pc.bold(reqVersion)}, but ${pc.bold(PROJECT_VERSION)} is installed.`
        )
        return
      }
      const extensionVersion = extensions[reqName]
      assertUsage(extensionVersion, `${errBase}.`)
      assertUsage(
        isVersionRange(extensionVersion, reqVersion),
        `${errBase} version ${pc.bold(reqVersion)}, but ${pc.bold(extensionVersion)} is installed.`
      )
    })
  })
}

function getConfigRequireValue(plusFile: PlusFile): null | Record<string, string> {
  const confVal = getConfVal(plusFile, 'require')
  if (!confVal) return null
  assert(confVal.configValueLoaded)
  const require = confVal.configValue
  const { filePathToShowToUserResolved } = plusFile.filePath
  assert(filePathToShowToUserResolved)
  assertUsage(
    isObjectOfStrings(require),
    `The setting ${pc.bold(
      'require'
    )} defined at ${filePathToShowToUserResolved} should be an object with string values (${pc.bold(
      'Record<string, string>'
    )}).`
  )
  return require
}

function getNameValue(plusFile: PlusFile): null | string {
  const confVal = getConfVal(plusFile, 'name')
  if (!confVal) return null
  assert(confVal.configValueLoaded)
  const name = confVal.configValue
  const filePathToShowToUser = getFilePathToShowToUser(plusFile)
  assertUsage(
    typeof name === 'string',
    `The setting ${pc.bold('name')} defined at ${filePathToShowToUser} should be a string.`
  )
  return name
}

// We use a forever cache: users need to restart the dev server anyways when touching node_modules/**/* (I presume Vite doesn't pick up node_modules/**/* changes).
const extensionsVersion: Record<string, string> = {}
function getExtensionVersion(name: string, plusFile: PlusFile): string {
  if (!extensionsVersion[name]) {
    const extensionConfigFilePath = plusFile.filePath.filePathAbsoluteFilesystem
    const found = findPackageJson(path.posix.dirname(extensionConfigFilePath))
    assert(found)
    const { packageJson, packageJsonPath } = found
    const filePathToShowToUser = getFilePathToShowToUser(plusFile)
    const nameExpected = packageJson.name
    assertWarning(
      name === nameExpected,
      `The setting ${pc.bold('name')} defined at ${filePathToShowToUser} is ${pc.bold(
        JSON.stringify(name)
      )}, but it should be equal to ${pc.bold(JSON.stringify(nameExpected))} (the value of ${packageJsonPath}${pc.dim(
        '#'
      )}${pc.bold('name')})`,
      { onlyOnce: true }
    )
    const { version } = packageJson
    assert(typeof version === 'string')
    extensionsVersion[name] = version
  }
  return extensionsVersion[name]!
}

function getFilePathToShowToUser(plusFile: PlusFile): string {
  const { filePathToShowToUserResolved } = plusFile.filePath
  assert(filePathToShowToUserResolved)
  return filePathToShowToUserResolved
}

function isVersionRange(version: string, range: string) {
  // Remove pre-release tag
  version = version.split('-')[0]!
  return semver.satisfies(version, range)
}
