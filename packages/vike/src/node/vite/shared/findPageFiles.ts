export { findPageFiles }

import { glob } from 'tinyglobby'
import type { ResolvedConfig } from 'vite'
import { scriptFileExtensionPattern } from '../../../utils/isScriptFile.js'
import { toPosixPath } from '../../../utils/path.js'
import type { FileType } from '../../../shared-server-client/getPageFiles/fileTypes.js'
import { getOutDirs } from './getOutDirs.js'
import '../assertEnvVite.js'

async function findPageFiles(config: ResolvedConfig, fileTypes: FileType[]): Promise<string[]> {
  const cwd = config.root
  const { outDirRoot } = getOutDirs(config, undefined)
  let pageFiles = await glob(
    fileTypes.map((fileType) => `**/*${fileType}.${scriptFileExtensionPattern}`),
    { ignore: ['**/node_modules/**', `${outDirRoot}/**`], cwd, dot: false, expandDirectories: false },
  )
  pageFiles = pageFiles.map((p) => '/' + toPosixPath(p))
  return pageFiles
}
