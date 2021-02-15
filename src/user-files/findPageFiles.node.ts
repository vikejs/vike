import { assert } from '../utils/assert'
import { FileType, findUserFiles2 } from './findUserFiles.shared'
import { relative } from 'path'
import { lowerFirst } from '../utils/sorter'

export { findPageFiles }

async function findPageFiles(fileType: FileType, pageId: string) {
  const userFiles = await findUserFiles2(fileType)

  const userFiles_forPage = []
  for (const filePath in userFiles) {
    assert(filePath.startsWith('/'))
    if (filePath.startsWith(pageId) || filePath.includes('/default.')) {
      const loadFile = userFiles[filePath]
      userFiles_forPage.push({ filePath, loadFile })
    }
  }
  // Get `*.default.page.*` files that are closest to the page's `*.page.js`
  userFiles_forPage.sort(
    lowerFirst(({ filePath }) => {
      const relativePath = relative(pageId, filePath)
      assert(!relativePath.includes('\\'))
      const changeDirCount = relativePath.split('/').length
      return changeDirCount
    })
  )
  return userFiles_forPage
}
