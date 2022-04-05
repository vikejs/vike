import { hasProp } from '../../../utils'
import { assertUsage } from '../../utils'

export type { PageFilesConfig }
export { getPageFilesConfig }

type PageFilesConfig = { include?: string[] }

function getPageFilesConfig(vitePluginSsrConfig: Record<string, unknown>) {
  const pageFilesConfig: PageFilesConfig = {
    include: [],
  }
  if (vitePluginSsrConfig.pageFiles === undefined) {
    return pageFilesConfig
  }
  assertUsage(
    hasProp(vitePluginSsrConfig, 'pageFiles', 'object'),
    '[vite.config.js][`ssr({ pageFiles })`] `pageFiles` should be an object',
  )
  const { pageFiles } = vitePluginSsrConfig
  if (pageFiles.include !== undefined) {
    assertUsage(
      hasProp(pageFiles, 'include', 'string[]'),
      '[vite.config.js][`ssr({ pageFiles: { include } })`] `include` should be a list of strings',
    )
    pageFilesConfig.include = pageFiles.include
  }
  return pageFilesConfig
}
