export { resolveConfigEnv }
export { clearFilesEnvMap }
export { isRelativeImportPath }

import pc from '@brillout/picocolors'
import type { ConfigEnvInternal } from '../../../../../../shared/page-configs/PageConfig.js'
import { assert, assertPosixPath, assertUsage, deepEqual } from '../../../../utils.js'
import type { FilePath } from '../../../../../../shared/page-configs/FilePath.js'
const filesEnvMap: Map<string, { configEnvResolved: ConfigEnvInternal; configName: string }[]> = new Map()

function clearFilesEnvMap() {
  filesEnvMap.clear()
}

function resolveConfigEnv(configEnv: ConfigEnvInternal, filePath: FilePath, configName: string) {
  const configEnvResolved = { ...configEnv }

  if (filePath.filePathAbsoluteFilesystem) {
    const { fileName } = filePath
    if (fileName.includes('.server.')) {
      configEnvResolved.server = true
      configEnvResolved.client = false
    } else if (fileName.includes('.client.')) {
      configEnvResolved.client = true
      configEnvResolved.server = false
    } else if (fileName.includes('.shared.')) {
      configEnvResolved.server = true
      configEnvResolved.client = true
    }
  }

  assertUsageFileEnv(filePath, configEnvResolved, configName)

  return configEnvResolved
}

function assertUsageFileEnv(filePath: FilePath, configEnvResolved: ConfigEnvInternal, configName: string) {
  let key: string
  if (filePath.filePathAbsoluteFilesystem) {
    key = filePath.filePathAbsoluteFilesystem
  } else {
    // Path alias
    key = filePath.filePathAbsoluteVite
  }
  assert(key)
  assertPosixPath(key)
  assert(!isRelativeImportPath(filePath.filePathAbsoluteVite))
  if (!filesEnvMap.has(key)) {
    filesEnvMap.set(key, [])
  }
  const fileEnv = filesEnvMap.get(key)!
  fileEnv.push({ configEnvResolved, configName })
  const configDifferentEnv = fileEnv.filter((c) => !deepEqual(c.configEnvResolved, configEnvResolved))[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${key} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnvResolved }].map(
          (c) =>
            `  - config ${pc.code(c.configName)} which value lives in environment ${pc.code(
              JSON.stringify(c.configEnvResolved)
            )}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vike.dev/config#pointer-imports'
      ].join('\n')
    )
  }
}

function isRelativeImportPath(importPath: string) {
  return importPath.startsWith('./') || importPath.startsWith('../')
}
