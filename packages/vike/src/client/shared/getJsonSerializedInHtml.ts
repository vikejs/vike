export { getPageContextSerializedInHtml }
export { getGlobalContextSerializedInHtml }

import { parse } from '@brillout/json-serializer/parse'
import { assert, assertUsage } from '../../utils/assert.js'
import { hasProp } from '../../utils/hasProp.js'
import { htmlElementId_globalContext, htmlElementId_pageContext } from '../../shared-server-client/htmlElementIds.js'
import '../assertEnvClient.js'

// elements should exist because:
// 1. <script id="vike_pageContext" type="application/json"> appears before the <script> that loads Vike's client runtime (which includes this file)
// 2. <script id="vike_pageContext" type="application/json"> is neither async nor defer
// See https://github.com/vikejs/vike/pull/1271

async function getPageContextSerializedInHtml(): Promise<{ pageId: string; routeParams: Record<string, string> }> {
  const pageContextJson = findJson(htmlElementId_pageContext)
  // A pageContext always serializes as `{…}`, so an array means streamed values https://vike.dev/passToClient#streaming
  const pageContextSerializedInHtml =
    pageContextJson[0] === '['
      ? (await import('./streamedValues.js')).parsePageContextHtml(pageContextJson)
      : parse(pageContextJson)
  assert(hasProp(pageContextSerializedInHtml, 'pageId', 'string'))
  assert(hasProp(pageContextSerializedInHtml, 'routeParams', 'string{}'))
  return pageContextSerializedInHtml
}

function getGlobalContextSerializedInHtml() {
  const globalContextSerializedInHtml = parse(findJson(htmlElementId_globalContext))
  return globalContextSerializedInHtml as object
}

function findJson(id: string) {
  const elem = document.getElementById(id)
  assertUsage(
    elem,
    // It seems like it can be missing when HTML is malformed: https://github.com/vikejs/vike/issues/913
    `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`,
  )
  const jsonStr = elem.textContent
  assert(jsonStr)
  return jsonStr
}
