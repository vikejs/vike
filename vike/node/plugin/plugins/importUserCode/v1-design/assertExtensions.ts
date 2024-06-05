export { assertExtensionsPeerDependencies }
export { assertExtensionsConventions }

import pc from '@brillout/picocolors'
import { isObjectOfStrings } from '../../../../../utils/isObjectOfStrings.js'
import { PROJECT_VERSION, assert, assertUsage, assertWarning, findPackageJson, joinEnglish } from '../../../utils.js'
import { getConfigValueInterfaceFile, type InterfaceFile } from './getVikeConfig.js'
import path from 'path'
import semver from 'semver'
import type { ConfigFile } from './getVikeConfig/loadFileAtConfigTime.js'

function assertExtensionsConventions(extendsConfig: ConfigFile, interfaceFile: InterfaceFile) {
  const alreadyMigrated = [
    'vike-react',
    'vike-react-query',
    'vike-react-zustand',
    'vike-vue',
    'vike-pinia',
    'vike-solid'
  ]
  const { importPathAbsolute } = extendsConfig.filePath
  assert(importPathAbsolute)
  const extensionName = importPathAbsolute
    .split('/')
    .slice(0, importPathAbsolute.startsWith('@') ? 2 : 1)
    .join('/')
  const errMsg = alreadyMigrated.includes(extensionName)
    ? `You're using a deprecated version of the Vike extension ${extensionName}, update ${extensionName} to its latest version.`
    : `The config of the Vike extension ${extensionName} should define the ${pc.cyan('name')} setting.`
  const extensionNameValue = getConfigValueInterfaceFile(interfaceFile, 'name')
  if (alreadyMigrated) {
    // Eventually remove (always use assertUsage())
    assertWarning(extensionNameValue, errMsg, { onlyOnce: true })
  } else {
    assertUsage(extensionNameValue, errMsg)
  }
  {
    const { filePathToShowToUserResolved } = interfaceFile.filePath
    assert(filePathToShowToUserResolved)
    const errPrefix = `The setting ${pc.bold('name')} defined at ${filePathToShowToUserResolved}`
    assertUsage(typeof extensionNameValue === 'string', `${errPrefix} should be a string.`)
    assertWarning(
      extensionNameValue === extensionName,
      `${errPrefix} is ${pc.bold(extensionNameValue)} but it should be ${pc.bold(extensionName)} instead.`,
      { onlyOnce: true }
    )
  }
  {
    const importPathAbsoluteExpected = `${extensionName}/config`
    assertWarning(
      importPathAbsolute === importPathAbsoluteExpected,
      `The Vike configuration of ${extensionName} is exported at ${pc.bold(
        importPathAbsolute
      )} but it should be exported at ${pc.bold(importPathAbsoluteExpected)} instead.`,
      { onlyOnce: true }
    )
  }
  if (extensionName.startsWith('vike-')) {
    const prefix = [
      //
      'vike-react',
      'vike-vue',
      'vike-solid',
      'vike-svelte',
      'vike-angular',
      'vike-preact'
    ]
    assertWarning(
      prefix.some((p) => extensionName === p || extensionName.startsWith(`${p}-`)),
      `The name of the Vike extension ${pc.bold(extensionName)} should be or start with ${joinEnglish(
        prefix.map(pc.bold),
        'or'
      )}.`,
      { onlyOnce: true }
    )
  }
}

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
