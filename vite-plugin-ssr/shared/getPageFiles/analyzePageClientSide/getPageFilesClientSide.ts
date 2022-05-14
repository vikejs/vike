export { getPageFilesClientSide }

import { getAllPageIdFilesClientSide } from '../getAllPageIdFiles'
import { PageFile } from '../types'

function getPageFilesClientSide(pageFilesAll: PageFile[], pageId: string) {
  return getAllPageIdFilesClientSide(pageFilesAll, pageId)
}
