export { extractStylesAddQuery }

import { assert, getFileExtension } from '../../utils'

function extractStylesAddQuery(id: string) {
  const fileExtension = getFileExtension(id)
  assert(fileExtension)
  return `${id}?extractStyles&lang.${fileExtension}`
}
