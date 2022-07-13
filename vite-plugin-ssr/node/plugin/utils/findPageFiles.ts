export { findPageFiles }

import glob from 'fast-glob'
import type { ResolvedConfig } from 'vite'
import { javascriptFileExtensions, isSSR_config } from '../utils'
import path from 'path'
import { assertWarning, toPosixPath } from '../../utils'

async function findPageFiles(config: ResolvedConfig): Promise<{ filePathRelative: string; filePathAbsolue: string }[]> {
  const ssr = isSSR_config(config)
  const cwd = config.root
  const start = new Date().getTime()
  const pageFiles_filePathRelative = await glob(
    [`**/*.page.${javascriptFileExtensions}`, `**/*.page.${ssr ? 'server' : 'client'}.${javascriptFileExtensions}`],
    { ignore: ['**/node_modules/**'], cwd },
  )
  const pageFiles = pageFiles_filePathRelative.map((filePathRelative) => ({
    filePathRelative: toPosixPath(filePathRelative),
    filePathAbsolue: toPosixPath(require.resolve(path.join(cwd, filePathRelative))),
  }))
  const time = new Date().getTime() - start
  assertWarning(
    time < 2 * 1000,
    `Finding your page files \`**/*.page.*\` took more than two seconds (${time}ms). Reach out to the vite-plugin-ssr maintainers.`,
    {
      onlyOnce: 'slow-page-files-search',
    },
  )
  return pageFiles
}
