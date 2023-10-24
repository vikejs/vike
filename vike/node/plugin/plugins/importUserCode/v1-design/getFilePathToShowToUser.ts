export { getFilePathToShowToUser }
export type { FilePath }

import { assert } from '../../../utils.js'

type FilePath = {
  /** The file's path relative to the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/Page.js`
   */
  filePathAbsoluteFilesystem: string
} & (
  | {
      /** The file's path relative to the Vite's root (i.e. the user's project root directory).
       *
       * Example: `/pages/some-page/Page.js`
       */
      filePathRelativeToUserRootDir: string
      importPathAbsolute: null
    }
  | {
      filePathRelativeToUserRootDir: null
      /** The file's absolute import path.
       *
       * Example: `vike-react/config`
       */
      importPathAbsolute: string
    }
)

/*
const f: FilePath = 1 as any
if (f.filePathRelativeToUserRootDir === null) {
  f.importPathAbsolute
}
//*/

function getFilePathToShowToUser(filePath: FilePath): string {
  const filePathToShowToUser = filePath.filePathRelativeToUserRootDir ?? filePath.filePathAbsoluteFilesystem
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
