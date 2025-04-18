export { getPageContextSerializedInHtml }

import { parse } from '@brillout/json-serializer/parse'
import { hasProp, assert, assertUsage } from './utils.js'

// elements should exist because:
// 1. <script id="vike_pageContext" type="application/json"> appears before the <script> that loads Vike's client runtime (which includes this file)
// 2. <script id="vike_pageContext" type="application/json"> is neither async nor defer
// See https://github.com/vikejs/vike/pull/1271
const elemId_pageContext = 'vike_pageContext'

function getPageContextSerializedInHtml(): { pageId: string; routeParams: Record<string, string> } {
  const pageContextSerializedInHtml = findAndParseJson(elemId_pageContext)
  assert(hasProp(pageContextSerializedInHtml, 'pageId', 'string'))
  assert(hasProp(pageContextSerializedInHtml, 'routeParams', 'string{}'))
  return pageContextSerializedInHtml
}

function findAndParseJson(id: string) {
  const elem = document.getElementById(id)
  assertUsage(
    elem,
    // It seems like it can be missing when HTML is malformed: https://github.com/vikejs/vike/issues/913
    `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`
  )
  const jsonStr = elem.textContent
  assert(jsonStr)
  const json = parse(jsonStr)
  return json
}
