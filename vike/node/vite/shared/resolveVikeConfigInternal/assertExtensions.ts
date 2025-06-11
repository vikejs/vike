export { assertExtensionsConventions }
export { assertExtensionsRequire }

import pc from '@brillout/picocolors'
import { PROJECT_VERSION, assert, assertUsage, assertWarning, findPackageJson, isObject } from '../../utils.js'
import { getConfVal } from '../resolveVikeConfigInternal.js'
import type { PlusFile } from './getPlusFilesAll.js'
import path from 'node:path'
import semver from 'semver'

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
      importPathAbsolute,
    )}, but it should be exported at ${pc.bold(importPathAbsoluteExpected)} instead.`,
    { onlyOnce: true },
  )
}
function assertExtensionName(plusFile: PlusFile): void {
  const filePathToShowToUser = getFilePathToShowToUser(plusFile)
  const name = getNameValue(plusFile)
  assertUsage(
    name,
    `Vike extension name missing: the config ${filePathToShowToUser} must define the setting ${pc.cyan('name')}`,
  )
}

function assertExtensionsRequire(plusFiles: PlusFile[]): void {
  const plusFilesRelevantList = plusFiles

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
    const require = resolveRequireSetting(plusFile)
    if (!require) return
    const name = getNameValue(plusFile)
    const filePathToShowToUser = getFilePathToShowToUser(plusFile)
    assertUsage(
      name,
      `Setting ${pc.bold('name')} is required for being able to use setting ${pc.bold(
        'require',
      )} in ${filePathToShowToUser}.`,
    )
    Object.entries(require).forEach(([reqName, req]) => {
      const errBase = `${pc.bold(name)} requires ${pc.bold(reqName)}` as const
      if (reqName === 'vike') {
        let errMsg = `${errBase} version ${pc.bold(req.version)}, but ${pc.bold(PROJECT_VERSION)} is installed.`
        if (req.optional) {
          errMsg += " Either update it, or remove it (it's an optional peer dependency)."
        }
        assertUsage(isVersionRange(PROJECT_VERSION, req.version), errMsg)
        return
      }
      const extensionVersion = extensions[reqName]
      if (!extensionVersion) {
        if (req.optional) {
          return
        } else {
          assertUsage(false, `${errBase}.`)
        }
      }
      assertUsage(
        isVersionRange(extensionVersion, req.version),
        `${errBase} version ${pc.bold(req.version)}, but ${pc.bold(extensionVersion)} is installed.`,
      )
    })
  })
}

type RequireSetting = Record<string, { version: string; optional: boolean }>
function resolveRequireSetting(plusFile: PlusFile): null | RequireSetting {
  const confVal = getConfVal(plusFile, 'require')
  if (!confVal) return null
  assert(confVal.valueIsLoaded)
  const requireValue = confVal.value
  const { filePathToShowToUserResolved } = plusFile.filePath
  assert(filePathToShowToUserResolved)
  assertUsage(
    isObject(requireValue),
    `The setting ${pc.bold('+require')} defined at ${filePathToShowToUserResolved} should be an object`,
  )
  const requireSetting: RequireSetting = {}
  Object.entries(requireValue).forEach(([reqName, req]) => {
    if (typeof req === 'string') {
      requireSetting[reqName] = { version: req, optional: false }
      return
    }
    if (isObject(req)) {
      requireSetting[reqName] = req as any
      return
    }
    assertUsage(false, `Invalid +require[${JSON.stringify(reqName)}] value ${pc.cyan(JSON.stringify(req))}`)
  })
  return requireSetting
}

function getNameValue(plusFile: PlusFile): null | string {
  const confVal = getConfVal(plusFile, 'name')
  if (!confVal) return null
  assert(confVal.valueIsLoaded)
  const name = confVal.value
  const filePathToShowToUser = getFilePathToShowToUser(plusFile)
  assertUsage(
    typeof name === 'string',
    `The setting ${pc.bold('name')} defined at ${filePathToShowToUser} should be a string.`,
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
        JSON.stringify(name),
      )}, but it should be equal to ${pc.bold(JSON.stringify(nameExpected))} (the value of ${packageJsonPath}${pc.dim(
        '#',
      )}${pc.bold('name')})`,
      { onlyOnce: true },
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
