import '../assertEnvClient.js'

export { getPageContextSerializedInHtml }
export { getGlobalContextSerializedInHtml }

import { parse } from '@brillout/json-serializer/parse'
import { assert, assertUsage } from '../../utils/assert.js'
import { hasProp } from '../../utils/hasProp.js'
import { htmlElementId_globalContext, htmlElementId_pageContext } from '../../shared-server-client/htmlElementIds.js'

// elements should exist because:
// 1. <script id="vike_pageContext" type="application/json"> appears before the <script> that loads Vike's client runtime (which includes this file)
// 2. <script id="vike_pageContext" type="application/json"> is neither async nor defer
// See https://github.com/vikejs/vike/pull/1271

function getPageContextSerializedInHtml(): { pageId: string; routeParams: Record<string, string> } {
  const pageContextSerializedInHtml = findAndParseJson(htmlElementId_pageContext)
  assert(hasProp(pageContextSerializedInHtml, 'pageId', 'string'))
  assert(hasProp(pageContextSerializedInHtml, 'routeParams', 'string{}'))
  return pageContextSerializedInHtml
}

function getGlobalContextSerializedInHtml() {
  const globalContextSerializedInHtml = findAndParseJson(htmlElementId_globalContext)
  return globalContextSerializedInHtml as object
}

function findAndParseJson(id: string) {
  const elem = document.getElementById(id)
  assertUsage(
    elem,
    // It seems like it can be missing when HTML is malformed: https://github.com/vikejs/vike/issues/913
    `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`,
  )
  const jsonStr = elem.textContent
  assert(jsonStr)
  const json = parse(jsonStr, {
    // Prevent Google from crawling URLs in JSON:
    // - https://github.com/vikejs/vike/pull/2603
    // - https://github.com/brillout/json-serializer/blob/38edbb9945de4938da1e65d6285ce1dd123a45ef/test/main.spec.ts#L44-L95
    reviver(_key, value) {
      if (typeof value === 'string') {
        return { replacement: value.replaceAll('\\/', '/'), resolved: false }
      }
    },
  })
  return json
}
