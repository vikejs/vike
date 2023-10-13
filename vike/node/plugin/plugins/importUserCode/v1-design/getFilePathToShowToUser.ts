export { getFilePathToShowToUser }
export type { FilePath }

import { assert } from '../../../utils.js'

type FilePath = {
  /** The file's path relative to the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/Page.js`
   */
  filePathAbsolute: string
  /** The file's path relative to the Vite's root (i.e. the user's project root directory).
   *
   * Example: `/pages/some-page/Page.js`
   */
  filePathRelativeToUserRootDir: null | string
}
function getFilePathToShowToUser(filePath: FilePath): string {
  const filePathToShowToUser = filePath.filePathRelativeToUserRootDir ?? filePath.filePathAbsolute
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
