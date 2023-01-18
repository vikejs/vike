export { addFileExtensionsToRequireResolve }

import { assert } from './assert'
import { scriptFileExtensionList } from './isScriptFile'

function addFileExtensionsToRequireResolve() {
  const added: string[] = []
  scriptFileExtensionList.forEach((ext: string) => {
    assert(!ext.includes('.'))
    ext = `.${ext}`
    if (!require.extensions[ext]) {
      require.extensions[ext] = require.extensions['.js']
      added.push(ext)
    }
  })
  const clean = () => {
    added.forEach((ext) => {
      delete require.extensions[ext]
    })
  }
  return clean
}
