import { FilePath, Html, PageServerConfig, PageView } from './types'

export { findUserFiles }
export { setFileFinder }

let fileFinder: () => Promise<any>
function setFileFinder(fileFinder_: () => Promise<any>): void {
  fileFinder = fileFinder_
}

function findUserFiles(
  fileType: '.page'
): Promise<Record<FilePath, () => Promise<{ default: PageView }>>>
function findUserFiles(
  fileType: '.server'
): Promise<Record<FilePath, () => Promise<{ default: PageServerConfig }>>>
function findUserFiles(
  fileType: '.html'
): Promise<Record<FilePath, () => Promise<{ default: Html }>>>
async function findUserFiles(
  fileType: '.page' | '.server' | '.html'
): Promise<never> {
  const filesByType = await fileFinder()
  const files = filesByType[fileType]
  return files as never
  // if (fileType === '.page') {
  //   //@ts-ignore
  //   return import.meta.glob('/**/*.page.*')
  // }
  // if (fileType === '.server') {
  //   //@ts-ignore
  //   return import.meta.glob('/**/*.server.*')
  // }
  // if (fileType === '.html') {
  //   //@ts-ignore
  //   return import.meta.glob('/**/*.html.*')
  // }
  // if (fileType === '.route') {
  //   //@ts-ignore
  //   return import.meta.glob('/**/*.route.*')
  // }
  // assert(false)
}
