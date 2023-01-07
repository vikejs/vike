import { getPageConfigs } from '../../../../shared/getPageFiles/getPageConfigsFromGlob'
import { loadPagesConfig } from '../../helpers'

export { generatePageCodeLoaders }

async function generatePageCodeLoaders(root: string): Promise<string> {
  let code = ''

  code += `export const root = '${root}';`
  code += 'export const pageCodeLoaders = {};'

  const pageConfigFiles = await loadPagesConfig(root)
  const pageConfigs = getPageConfigs(pageConfigFiles, root)
  pageConfigs.forEach((pageConfig) => {
    code += `pageCodeLoaders['${pageConfig.pageId2}'] = async () => ({`
    ;(['onRenderHtml', 'onRenderClient', 'Page'] as const).forEach((prop) => {
      const importPath = pageConfig[prop]
      if (importPath) {
        // TODO: use virtual file instead
        code += `  ${prop}: await import('${importPath}'),`
      }
    })
    code += `});`
  })

  return code
}
