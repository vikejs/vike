export type { FilePath }
export type { FilePathResolved }

type FilePathResolved = FilePath & {
  filePathAbsoluteFilesystem: string
  /**
   * The file's path, shown to the user in logs.
   *
   * Resolved: it always shows a file path. (It nevers shows an import path such as `vike-react/config`.)
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.filePathAbsoluteFilesystem`.
   */
  filePathToShowToUserResolved: string
}

// FilePath always comes from user-land code analysis, thus at least one of the following is defined:
type IsReferencedByUserLandFile = { filePathAbsoluteUserRootDir: string } | { importPathAbsolute: string }
type FilePath = FilePathProps & IsReferencedByUserLandFile

type FilePathProps = {
  /**
   * The file's path, absolute starting from the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/+Page.js`
   *
   * The value is `null` for imports using path aliases. (Because Vike cannot resolve path aliases, otherwise Vike would need to re-implement https://www.npmjs.com/package/@rollup/plugin-alias.)
   */
  filePathAbsoluteFilesystem: string | null

  /**
   * The file's path, absolute starting from the user root directory (i.e. Vite's `config.root`).
   *
   * Example: `/pages/some-page/+Page.js`.
   *
   * Its value is `null` if the file is outside of the user root directory (i.e. Vite's `config.root`).
   *
   */
  filePathAbsoluteUserRootDir: string | null

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
   * We use it to generate import paths in virtual modules. (Since import paths in virtual modules cannot be relative.)
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.importPathAbsolute`.
   */
  filePathAbsoluteVite: string

  /**
   * The file's non-relative import path. It's either:
   *  - an npm package import (e.g. `vike-react/config`), or
   *  - a path alias import (e.g. `#components/Counter').
   */
  importPathAbsolute: string | null


  fileName: string
}
