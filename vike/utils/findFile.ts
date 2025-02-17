export { findFile }

import path from 'path'
import fs from 'fs'
import { isArray } from './isArray.js'
import { assertPosixPath } from './path.js'

type Filename = 'package.json' | 'vike.config.js' | 'vike.config.ts'

// We need to be able to crawl the filesystem, regardless of Vike's `$ git ls-files` command call, because we need to fallback if the user didn't setup Git (e.g. we cannot remove the tinyglobby fallback).
function findFile(arg: Filename | Filename[], cwd: string): null | string {
  assertPosixPath(cwd)
  const filenames = isArray(arg) ? arg : [arg]
  let dir = cwd
  while (true) {
    for (const filename of filenames) {
      const configFilePath = path.posix.join(dir, `./${filename}`)
      if (fs.existsSync(configFilePath)) {
        assertPosixPath(configFilePath)
        return configFilePath
      }
    }
    const dirPrevious = dir
    dir = path.posix.dirname(dir)
    if (dir === dirPrevious) {
      return null
    }
  }
}
