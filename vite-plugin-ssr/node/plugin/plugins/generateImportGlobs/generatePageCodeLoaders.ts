import { generatePageConfigsDataCode } from './getPageConfigs'

export { generatePageCodeLoaders }

async function generatePageCodeLoaders(root: string, isForClientSide: boolean): Promise<string> {
  const code = await generatePageConfigsDataCode(root, isForClientSide)
  return code

  /* TODO: remove?
  const codeExportNames = ['Page', isForClientSide ? 'onRenderClient' : 'onRenderHtml'] as const // TODO move this logic

  const result = await loadPageConfigFiles(root)
  if ('hasError' in result) {
    lines.push('export const pageConfigFilesCannotBeLoaded = true;')
    lines.push('export const pageConfigFiles = null;')
    lines.push('export const pageConfigs = null;')
  } else {
    lines.push('export const pageConfigFilesCannotBeLoaded = false;')
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
  const code = lines.join('\n')
  */
}
