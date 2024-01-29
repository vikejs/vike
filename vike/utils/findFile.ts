export { findFile }

import path from 'path'
import fs from 'fs'

type Filename = 'package.json' | 'vike.config.js' | 'vike.config.ts'

function findFile(arg: Filename | Filename[], cwd: string): null | string {
  const filenames = Array.isArray(arg) ? arg : [arg]
  let dir = cwd
  while (true) {
    for (const filename of filenames) {
      const configFilePath = path.join(dir, `./${filename}`)
      if (fs.existsSync(configFilePath)) {
        // return toPosixPath(configFilePath)
        return configFilePath
      }
    }
    const dirPrevious = dir
    dir = path.dirname(dir)
    if (dir === dirPrevious) {
      return null
    }
  }
}
