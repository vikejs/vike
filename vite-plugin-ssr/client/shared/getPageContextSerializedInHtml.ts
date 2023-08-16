import { parse } from '@brillout/json-serializer/parse'
import { hasProp, assert, assertUsage, objectAssign } from '../server-routing-runtime/utils.js'

export { getPageContextSerializedInHtml }

function getPageContextSerializedInHtml(): { _pageId: string; _hasPageContextFromServer: true } {
  const id = 'vite-plugin-ssr_pageContext'
  const elem = document.getElementById(id)
  assertUsage(
    elem,
    `The element #${id} (which vite-plugin-ssr automatically injects into the HTML) is missing from the DOM. This may happen if your HTML is malformed. Make sure your HTML isn't malformed, and make sure you don't remove #${id} from the HTML nor from the DOM.`
  )
  const pageContextJson = elem.textContent
  assert(pageContextJson)

  const pageContextSerializedInHtml = parse(pageContextJson)
  assert(hasProp(pageContextSerializedInHtml, '_pageId', 'string'))

  objectAssign(pageContextSerializedInHtml, {
    _hasPageContextFromServer: true as const
  })

  return pageContextSerializedInHtml
}
