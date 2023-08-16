export { getFilePathToShowToUser }
export type { FilePath }

import { assert } from '../../../utils.js'

type FilePath = {
  filePathAbsolute: string
  filePathRelativeToUserRootDir: null | string
}
function getFilePathToShowToUser(filePath: FilePath) {
  const filePathToShowToUser = filePath.filePathRelativeToUserRootDir ?? filePath.filePathAbsolute
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
