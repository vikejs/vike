import { getPageConfigs } from '../../../../shared/getPageFiles/getPageConfigsFromGlob'
import { loadPagesConfig } from '../../helpers'

export { generatePageCodeLoaders }

async function generatePageCodeLoaders(root: string): Promise<string> {
  const lines: string[] = []

  lines.push('export const pageCodeLoaders = {};')

  const pageConfigFiles = await loadPagesConfig(root)
  const pageConfigs = getPageConfigs(pageConfigFiles)
  pageConfigs.forEach((pageConfig) => {
    lines.push(`pageCodeLoaders['${pageConfig.pageId2}'] = async () => ([`)
    ;(['onRenderHtml', 'onRenderClient', 'Page'] as const).forEach((codeExportName) => {
      const codeExportFilePath = pageConfig[codeExportName]
      if (codeExportFilePath) {
        // TODO: use virtual file instead
        lines.push(
          ...[
            `  {`,
            `    codeExportName: '${codeExportName}',`,
            `    codeExportFilePath: '${codeExportFilePath}',`,
            `    codeExportFileExports: await import('${codeExportFilePath}')`,
            `  },`
          ]
        )
      }
    })
    lines.push(`]);`)
  })

  return lines.join('\n')
}
