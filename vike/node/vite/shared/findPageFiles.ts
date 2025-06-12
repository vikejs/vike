export { findPageFiles }

import { glob } from 'tinyglobby'
import type { ResolvedConfig } from 'vite'
import { assertWarning, toPosixPath, scriptFileExtensionPattern } from '../utils.js'
import type { FileType } from '../../../shared/getPageFiles/fileTypes.js'
import pc from '@brillout/picocolors'
import { getOutDirs } from './getOutDirs.js'

async function findPageFiles(config: ResolvedConfig, fileTypes: FileType[], isDev: boolean): Promise<string[]> {
  const cwd = config.root
  const { outDirRoot } = getOutDirs(config)
  const timeBase = new Date().getTime()
  let pageFiles = await glob(
    fileTypes.map((fileType) => `**/*${fileType}.${scriptFileExtensionPattern}`),
    { ignore: ['**/node_modules/**', `${outDirRoot}/**`], cwd, dot: false, expandDirectories: false },
  )
  pageFiles = pageFiles.map((p) => '/' + toPosixPath(p))
  const time = new Date().getTime() - timeBase
  if (isDev) {
    // We only warn in dev, because while building it's expected to take a long time as tinyglobby is competing for resources with other tasks
    assertWarning(
      time < 1.5 * 1000,
      `Finding your page files ${pc.cyan(
        '**/*.page.*',
      )} took an unexpected long time (${time}ms). Reach out to the vike maintainer.`,
      {
        onlyOnce: 'slow-page-files-search',
      },
    )
  }
  return pageFiles
}
