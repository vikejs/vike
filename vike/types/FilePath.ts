export type { FilePath }
export type { FilePathUnresolved }
export type { FilePathResolved }

type FilePath = FilePathResolved | FilePathUnresolved

type FilePathUnresolved = FilePathCommon & { filePathAbsoluteFilesystem: null } & ImportPathAbsolute

type FilePathResolved = FilePathCommon & {
  /**
   * The file's path, absolute starting from the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/+Page.js`
   *
   * The value is `null` for imports using path aliases. (Because Vike cannot resolve path aliases, otherwise Vike would need to re-implement https://www.npmjs.com/package/@rollup/plugin-alias.)
   */
  filePathAbsoluteFilesystem: string

  /**
   * The file's path, shown to the user in logs.
   *
   * Resolved: it always shows a file path. (It nevers shows an import path such as `vike-react/config`.)
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.filePathAbsoluteFilesystem`.
   */
  filePathToShowToUserResolved: string

  /**
   * File's name (without its file path).
   *
   * Example: `+Page.js`
   */
  fileName: string

  // At least filePathAbsoluteUserRootDir or importPathAbsolute is defined. (FilePath always originates from user-land code analysis.)
} & (FilePathAbsoluteUserRootDir | ImportPathAbsolute)

type ImportPathAbsolute = {
  /**
   * The file's non-relative import path. It's either:
   *  - an npm package import (e.g. `vike-react/config`), or
   *  - a path alias import (e.g. `#components/Counter').
   */
  importPathAbsolute: string
  filePathAbsoluteUserRootDir: null
}
type FilePathAbsoluteUserRootDir = {
  /**
   * The file's path, absolute starting from the user root directory (i.e. Vite's `config.root`).
   *
   * Example: `/pages/some-page/+Page.js`.
   *
   * Its value is `null` if the file is outside of the user root directory (i.e. Vite's `config.root`).
   *
   */
  filePathAbsoluteUserRootDir: string
  importPathAbsolute: string | null
}
type FilePathCommon = {
  /**
   * The file's path, shown to the user in logs.
   *
   * Unresolved: it may show an import path instead of a file path such as `vike-react/config`.
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.importPathAbsolute`.
   */
  filePathToShowToUser: string

  /**
   * The file's non-relative path, from Vite's perspective.
   *
   * Examples:
   *   - `/pages/+config.js`
   *   - `vike-react/config`
   *
   * We use it to generate imports in virtual modules. (Since import paths in virtual modules cannot be relative.)
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.importPathAbsolute`.
   */
  filePathAbsoluteVite: string
}
