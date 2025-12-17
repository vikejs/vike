export { getFileExtension }

import { slice } from './slice.js'

function getFileExtension(id: string) {
  id = id.split('?')[0]!

  const fileName = slice(id.split('/'), -1, 0)[0]
  if (!fileName) {
    return null
  }

  const fileExtension = slice(fileName.split('.'), -1, 0)[0]
  if (!fileExtension) {
    return null
  }

  return fileExtension
}
