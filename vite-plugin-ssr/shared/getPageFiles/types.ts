export type { FileType }
export type { PageFile }
export { fileTypes }

const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]
type PageFile = {
  filePath: string
  fileType: FileType
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
