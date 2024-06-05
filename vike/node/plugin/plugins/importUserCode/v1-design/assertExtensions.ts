export { assertExtensionsPeerDependencies }

import pc from '@brillout/picocolors'
import { isObjectOfStrings } from '../../../../../utils/isObjectOfStrings.js'
import { PROJECT_VERSION, assert, assertUsage, findPackageJson } from '../../../utils.js'
import { getConfigValueInterfaceFile, type InterfaceFile } from './getVikeConfig.js'
import path from 'path'
import semver from 'semver'

function assertExtensionsPeerDependencies(interfaceFilesRelevantList: InterfaceFile[]) {
  // Get installed extensions
  const extensions: Record<string, string> = {}
  interfaceFilesRelevantList.forEach((interfaceFile) => {
    const name = getConfigNameValue(interfaceFile)
    if (name) {
      const extensionConfigFilePath = interfaceFile.filePath.filePathAbsoluteFilesystem
      const version = getExtensionVersion(extensionConfigFilePath, name)
      extensions[name] = version
    }
  })

  // Enforce peer dependencies
  interfaceFilesRelevantList.forEach((interfaceFile) => {
    const require = getConfigRequireValue(interfaceFile)
    if (!require) return
    const name = getConfigNameValue(interfaceFile)
    // TODO: unify assertUsage()?
    assertUsage(name, `Setting ${pc.bold('name')} is required when using setting ${pc.bold('require')}.`)
    Object.entries(require).forEach(([reqName, reqVersion]) => {
      const errBase = `The Vike extension ${pc.bold(name)} requires ${pc.bold(reqName)}`
      if (reqName === 'vike') {
        assertUsage(
          semver.satisfies(PROJECT_VERSION, reqVersion),
          `${errBase} version ${pc.bold(reqVersion)} but ${pc.bold(PROJECT_VERSION)} is installed.`
        )
      }
      const extensionVersion = extensions[reqName]
      assertUsage(extensionVersion, `${errBase}.`)
      assertUsage(
        semver.satisfies(extensionVersion, reqVersion),
        `${errBase} version ${pc.bold(reqVersion)} but ${pc.bold(extensionVersion)} is installed.`
      )
    })
  })
}

function getConfigRequireValue(interfaceFile: InterfaceFile): null | Record<string, string> {
  const require = getConfigValueInterfaceFile(interfaceFile, 'require')
  if (!require) return null
  const { filePathToShowToUserResolved } = interfaceFile.filePath
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
function getConfigNameValue(interfaceFile: InterfaceFile): null | string {
  const name = getConfigValueInterfaceFile(interfaceFile, 'name')
  if (!name) return null
  // TODO: move assertUsage() here
  assert(typeof name === 'string')
  return name
}

// We use a forever cache: users need to restart the dev server anyways when touching node_modules/**/* (I presume Vite doesn't pick up node_modules/**/* changes).
const extensionsVersion: Record<string, string> = {}
function getExtensionVersion(extensionConfigFilePath: string, name: string): string {
  if (!extensionsVersion[name]) {
    const found = findPackageJson(path.posix.dirname(extensionConfigFilePath))
    assert(found)
    const { packageJson, packageJsonPath } = found
    assertUsage(
      packageJson.name === name,
      `The setting ${pc.bold('name')} set by ${extensionConfigFilePath} is ${pc.bold(
        JSON.stringify(name)
      )} but it should be equal to ${packageJsonPath}${pc.dim('#')}${pc.bold('name')} which is ${pc.bold(
        JSON.stringify(packageJson.name)
      )}`
    )
    const { version } = packageJson
    assert(typeof version === 'string')
    extensionsVersion[name] = version
  }
  return extensionsVersion[name]!
}
