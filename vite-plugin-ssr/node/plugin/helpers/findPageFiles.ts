export { findPageFiles }

import glob from 'fast-glob'
import type { ResolvedConfig } from 'vite'
import { assertWarning, toPosixPath, scriptFileExtensions } from '../utils'
import type { FileType } from '../../../shared/getPageFiles/fileTypes'

async function findPageFiles(config: ResolvedConfig, fileTypes: FileType[]): Promise<string[]> {
  const cwd = config.root
  const timeBase = new Date().getTime()
  let pageFiles = await glob(
    fileTypes.map((fileType) => `**/*${fileType}.${scriptFileExtensions}`),
    { ignore: ['**/node_modules/**'], cwd }
  )
  pageFiles = pageFiles.map((p) => '/' + toPosixPath(p))
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Finding your page files \`**/*.page.*\` took more than two seconds (${time}ms). Reach out to the vite-plugin-ssr maintainers.`,
    {
      showStackTrace: false,
      onlyOnce: 'slow-page-files-search'
    }
  )
  return pageFiles
}
