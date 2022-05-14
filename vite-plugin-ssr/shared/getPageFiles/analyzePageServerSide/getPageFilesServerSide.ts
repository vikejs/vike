export { getPageFilesServerSide }

import { getAllPageIdFilesServerSide } from '../getAllPageIdFiles'
import { PageFile } from '../types'

function getPageFilesServerSide(pageFilesAll: PageFile[], pageId: string) {
  return getAllPageIdFilesServerSide(pageFilesAll, pageId)
}
