export type { FileType } // TODO: move to own file fileTypes.ts
export type { PageFile }
export { fileTypes }
export { isValidFileType }

const fileTypes = [
  '.page',
  '.page.server',
  '.page.route',
  '.page.client',
  // - `.css` page files are only supported for npm packages
  // - npm packages are expected to always build their page files
  // - We can therefore expect that there isn't any `.page.server.sass`/...
  '.css'
] as const
type FileType = typeof fileTypes[number]
type PageFile = {
  filePath: string
  fileType: FileType
  isEnvFile: (env: 'client' | 'server' | 'isomph') => boolean
  fileExports?: Record<string, unknown>
  loadFile?: () => Promise<void>
  exportNames?: string[]
  loadExportNames?: () => Promise<void>
  isRelevant: (pageId: string) => boolean
  isDefaultPageFile: boolean
  isRendererPageFile: boolean
  isErrorPageFile: boolean
  pageId: string
}

function isValidFileType(filePath: string): boolean {
  return ['.js', '.mjs', '.cjs', '.css'].some((ext) => filePath.endsWith(ext))
}
