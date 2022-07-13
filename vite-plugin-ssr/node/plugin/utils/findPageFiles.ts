export { findPageFiles }

import glob from 'fast-glob'
import type { ResolvedConfig } from 'vite'
import { javascriptFileExtensions, isSSR_config } from '../utils'
import { assertWarning, toPosixPath } from '../../utils'

async function findPageFiles(config: ResolvedConfig): Promise<string[]> {
  const ssr = isSSR_config(config)
  const cwd = config.root
  const timeBase = new Date().getTime()
  let pageFiles = await glob(
    [`**/*.page.${javascriptFileExtensions}`, `**/*.page.${ssr ? 'server' : 'client'}.${javascriptFileExtensions}`],
    { ignore: ['**/node_modules/**'], cwd },
  )
  pageFiles = pageFiles.map((p) => '/' + toPosixPath(p))
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Finding your page files \`**/*.page.*\` took more than two seconds (${time}ms). Reach out to the vite-plugin-ssr maintainers.`,
    {
      onlyOnce: 'slow-page-files-search',
    },
  )
  return pageFiles
}
