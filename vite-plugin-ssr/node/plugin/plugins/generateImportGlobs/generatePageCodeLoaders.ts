import { getPageConfigs } from '../../../../shared/getPageFiles/getPageConfigsFromGlob'
import { loadPageConfigFiles } from '../../helpers'

export { generatePageCodeLoaders }

async function generatePageCodeLoaders(root: string, isForClientSide: boolean): Promise<string> {
  const lines: string[] = []

  lines.push('export const pageCodeLoaders = {};')

  const codeExportNames = ['Page', isForClientSide ? 'onRenderClient' : 'onRenderHtml'] as const // TODO move this logic

  const result = await loadPageConfigFiles(root)
  if ('hasError' in result) {
    lines.push('export const pageConfigHasBuildError = true;')
  } else {
    const { pageConfigFiles } = result
    const pageConfigs = getPageConfigs(pageConfigFiles)
    pageConfigs.forEach((pageConfig) => {
      lines.push(`pageCodeLoaders['${pageConfig.pageId2}'] = async () => ([`)
      codeExportNames.forEach((codeExportName) => {
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
  }

  return lines.join('\n')
}
