export { findPageFiles }

import glob from 'fast-glob'
import type { ResolvedConfig } from 'vite'
import { assertWarning, toPosixPath, scriptFileExtensions } from '../utils.js'
import type { FileType } from '../../../shared/getPageFiles/fileTypes.js'

async function findPageFiles(config: ResolvedConfig, fileTypes: FileType[], isDev: boolean): Promise<string[]> {
  const cwd = config.root
  const timeBase = new Date().getTime()
  let pageFiles = await glob(
    fileTypes.map((fileType) => `**/*${fileType}.${scriptFileExtensions}`),
    { ignore: ['**/node_modules/**'], cwd, dot: false }
  )
  pageFiles = pageFiles.map((p) => '/' + toPosixPath(p))
  const time = new Date().getTime() - timeBase
  if (isDev) {
    // We only warn in dev, because while building it's expected to take a long time as fast-glob is competing for resources with other tasks
    assertWarning(
      time < 1.5 * 1000,
      `Finding your page files \`**/*.page.*\` took an unexpected long time (${time}ms). Reach out to the vite-plugin-ssr maintainer.`,
      {
        onlyOnce: 'slow-page-files-search'
      }
    )
  }
  return pageFiles
}
