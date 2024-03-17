export type { FilePath }
export type { FilePathResolved }

type FilePathResolved = FilePath & { filePathAbsoluteFilesystem: string; filePathToShowToUserResolved: string }
type FilePath = {
  /** The file's path, non-relative from Vite's perspective.
   *
   * Its value is equivalent to `filePath.filePathAbsoluteUserRootDir ?? filePath.importPathAbsolute`, for example:
   *   - `vike-react/config`, or
   *   - `/pages/+config.js`.
   *
   * We use it to generate import paths in virtual modules. (Since virtual modules cannot have relative import paths.)
   */
  filePathAbsoluteVite: string
  /** The file's path, absolute starting from the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/Page.js`
   *
   * The value is `null` upon aliased import paths which we cannot resolve (we'd need to re-implement https://www.npmjs.com/package/@rollup/plugin-alias).
   */
  filePathAbsoluteFilesystem: string | null
  /** The file's path, shown to user upon logging.
   *
   * Unresolved: it may show an import path of a package e.g. `vike-react/config`.
   *
   * Currently, its value is equivalent to `FilePath['filePathAbsoluteVite']`.
   */
  filePathToShowToUser: string
  /** The file's path, shown to user upon logging.
   *
   * Resolved: it always shows an absolute file path.
   *
   * Currently, its value is equivalent to `FilePath['filePathAbsoluteUserRootDir'] | FilePath['filePathAbsoluteFilesystem'] `.
   */
  filePathToShowToUserResolved: string | null
  /** The file's path, absolute starting from the user root directory (i.e. Vite's `config.root`).
   *
   * Example: `/pages/some-page/Page.js`
   */
  filePathAbsoluteUserRootDir: string | null
  /** The file's path, as absolute import path. It's either:
   *  - an npm package import (e.g. `vike-react/config`), or
   *  - an alias (`#components/Counter').
   */
  importPathAbsolute: string | null
} & ({ importPathAbsolute: string } | { filePathAbsoluteUserRootDir: string })
