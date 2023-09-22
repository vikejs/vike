export { findUserPackageJsonPath }

import path from 'path'
import fs from 'fs'

function findUserPackageJsonPath(userDir: string): null | string {
  let dir = userDir
  while (true) {
    const configFilePath = path.join(dir, './package.json')
    if (fs.existsSync(configFilePath)) {
      // return toPosixPath(configFilePath)
      return configFilePath
    }
    const dirPrevious = dir
    dir = path.dirname(dir)
    if (dir === dirPrevious) {
      return null
    }
  }
}
