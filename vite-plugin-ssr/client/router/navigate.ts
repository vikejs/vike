export { navigate }
export { defineNavigate }

import { assertUsage, isBrowser, getGlobalObject, assertClientRouting, checkIfClientRouting } from './utils'

assertClientRouting()

const globalObject = getGlobalObject<{
  navigate?: typeof navigate
}>('navigate.ts', {})

/** Programmatically navigate to a new page.
 *
 * https://vite-plugin-ssr.com/navigate
 *
 * @param url - The URL of the new page.
 * @param keepScrollPosition - Don't scroll to the top of the page, instead keep the current scroll position.
 * @param overwriteLastHistoryEntry - Don't create a new entry in the browser's history, instead let the new URL replace the current URL. (This effectively removes the current URL from the browser history).
 */
async function navigate(
  url: string,
  { keepScrollPosition = false, overwriteLastHistoryEntry = false } = {}
): Promise<void> {
  assertUsage(
    isBrowser(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.',
    { showStackTrace: true }
  )
  const errMsg = 'navigate() only works with Client Routing, see https://vite-plugin-ssr.com/navigate'
  assertUsage(globalObject.navigate, errMsg, { showStackTrace: true })
  assertUsage(checkIfClientRouting(), errMsg, { showStackTrace: true })
  assertUsage(url, '[navigate(url)] Missing argument `url`.', { showStackTrace: true })
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.',
    { showStackTrace: true }
  )
  assertUsage(
    typeof keepScrollPosition === 'boolean',
    '[navigate(url, { keepScrollPosition })] Argument `keepScrollPosition` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof keepScrollPosition +
      '"`.',
    { showStackTrace: true }
  )
  assertUsage(
    typeof overwriteLastHistoryEntry === 'boolean',
    '[navigate(url, { overwriteLastHistoryEntry })] Argument `overwriteLastHistoryEntry` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof overwriteLastHistoryEntry +
      '"`.',
    { showStackTrace: true }
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.', {
    showStackTrace: true
  })
  await globalObject.navigate(url, { keepScrollPosition, overwriteLastHistoryEntry })
}

function defineNavigate(navigate_: typeof navigate) {
  globalObject.navigate = navigate_
}
