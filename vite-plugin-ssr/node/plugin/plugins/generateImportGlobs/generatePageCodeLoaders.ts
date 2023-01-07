import { getPageConfigs } from '../../../../shared/getPageFiles/getPageConfigsFromGlob'
import { loadPagesConfig } from '../../helpers'

export { generatePageCodeLoaders }

async function generatePageCodeLoaders(root: string): Promise<string> {
  const lines: string[] = []

  lines.push('export const pageCodeLoaders = {};')

  const pageConfigFiles = await loadPagesConfig(root)
  const pageConfigs = getPageConfigs(pageConfigFiles)
  pageConfigs.forEach((pageConfig) => {
    lines.push(`pageCodeLoaders['${pageConfig.pageId2}'] = async () => ({`)
    ;(['onRenderHtml', 'onRenderClient', 'Page'] as const).forEach((prop) => {
      const importPath = pageConfig[prop]
      if (importPath) {
        // TODO: use virtual file instead
        lines.push(`  ${prop}: await import('${importPath}'),`)
      }
    })
    lines.push(`});`)
  })

  return lines.join('\n')
}
