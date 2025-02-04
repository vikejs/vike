export { resolveConfigEnv }
export { isRelativeImportPath }

import type { ConfigEnvInternal } from '../../../../../../shared/page-configs/PageConfig.js'
import type { FilePath } from '../../../../../../shared/page-configs/FilePath.js'

// TODO/now move
function resolveConfigEnv(configEnv: ConfigEnvInternal, filePath: FilePath) {
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

  return configEnvResolved
}

// TODO/now dedupe
function isRelativeImportPath(importPath: string) {
  return importPath.startsWith('./') || importPath.startsWith('../')
}
