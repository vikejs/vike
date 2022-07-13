export { getPageFilesClientSide }

import { getAllPageIdFilesClientSide } from '../getAllPageIdFiles'
import { PageFile } from '../types'

function getPageFilesClientSide(pageFilesAll: PageFile[], pageId: string): PageFile[] {
  return getAllPageIdFilesClientSide(pageFilesAll, pageId)
}
