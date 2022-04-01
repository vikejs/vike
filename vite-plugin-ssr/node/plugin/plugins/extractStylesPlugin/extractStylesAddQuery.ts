import { assert, getFileExtension } from '../../utils'

export { extractStylesAddQuery }

function extractStylesAddQuery(id: string) {
  const fileExtension = getFileExtension(id)
  assert(fileExtension)
  return `${id}?extractStyles&lang.${fileExtension}`
}
