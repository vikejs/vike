// We don't import from `../../../plugin/utils` because `extractStylesAddQuery()` is imported by the server-side runtime; we don't want the server-side runtime to import `plugin/utils/*`.
import { assert } from '../../../../utils/assert'
import { getFileExtension } from '../../../../utils/getFileExtension'

export { extractStylesAddQuery }

function extractStylesAddQuery(id: string) {
  const fileExtension = getFileExtension(id)
  assert(fileExtension)
  return `${id}?extractStyles&lang.${fileExtension}`
}
