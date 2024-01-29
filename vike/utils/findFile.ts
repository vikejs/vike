export { findFile }

import path from 'path'
import fs from 'fs'

function findFile(fileName: 'package.json', userRootDir: string): null | string {
  let dir = userRootDir
  while (true) {
    const configFilePath = path.join(dir, `./${fileName}`)
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
