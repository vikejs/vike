export { assertFilePathAbsoluteFilesystem }
export { isFilePathAbsolute }

import path from 'node:path'
import { assert } from './assert.js'
import { assertPosixPath } from './path.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
assertIsNotBrowser()
// Server runtime shouldn't depend on node:path
assertIsNotProductionRuntime()

/**
 * Asserts that `filePath` is an absolute file path starting from the filesystem root.
 *
 * It isn't reliable for Linux users, but that's okay because the assertion will eventually fail on windows.
 */
function assertFilePathAbsoluteFilesystem(filePath: string) {
  // The assert is "eventually reliable":
  // - For Windows users, the assert is correct.
  // - For Linux users assertFilePathAbsoluteFilesystem() will erroneously succeed if `p` is a path absolute from the user root dir.
  //   - But that's okay because the assertion will eventually fail for Windows users.
  //   - On Linux there doesn't seem to be a way to distinguish between an absolute path starting from the filesystem root or starting from the user root directory, see comment at isFilePathAbsoluteFilesystem()
  assertPosixPath(filePath)
  assert(isFilePathAbsoluteFilesystem(filePath))
}

/**
 * Whether `filePath` is an absolute file path starting from the filesystem root.
 *
 * Isn't reliable for Linux users: it returns `true` for an absolute path starting from the user root dir.
 */
function isFilePathAbsoluteFilesystem(filePath: string) {
  assert(!filePath.startsWith('/@fs/'))
  if (process.platform !== 'win32') {
    // - For linux users, there doesn't seem to be a reliable way to distinguish between:
    //   - File path absolute starting from filesystem root, e.g. /home/rom/code/my-app/pages/about/+Page.js
    //   - File path absolute starting from user root dir (Vite's `config.root`), e.g. /pages/about/+Page.js
    // - Checking whether `p` starts with the first directory of process.cwd() (or `userRootDir`) can be erroneous, most notably when using docker: https://github.com/vikejs/vike/issues/703
    // - Using require.resolve() or node:fs to check wehther the file/dir exsits would be a solution, but maybe too slow?
    return filePath.startsWith('/')
  } else {
    const yes = path.win32.isAbsolute(filePath)
    // Ensure isFilePathAbsoluteFilesystem() returns `false` if path is absolute starting from the user root dir (see comments above).
    if (yes) assert(!filePath.startsWith('/'))
    return yes
  }
}

/**
 * Whether `filePath` is an absolute file path.
 *
 * Returns `true` regardless whether it starts from the user root dir or filesystem root.
 */
function isFilePathAbsolute(filePath: string): boolean {
  assert(!filePath.startsWith('/@fs/'))
  // Absolute path starting from the user root dir.
  if (filePath.startsWith('/')) return true
  // Seems to be reliable: https://nodejs.org/api/path.html#pathisabsolutepath
  return path.isAbsolute(filePath)
}
