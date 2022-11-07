export { navigate }
export { defineNavigate }

import { assertUsage, isBrowser, getGlobalObject } from './utils'

const globalObject = getGlobalObject<{
  navigate?: typeof navigate
}>('navigate.ts', {})

/** Programmatically navigate to a new page, see https://vite-plugin-ssr.com/navigate */
async function navigate(
  /** URL of the page to navigate to */
  url: string,
  {
    /** Don't scroll to the top of the page; keep scroll position where it is instead. */
    keepScrollPosition = false,
    /**  Don't create a new entry in the browser's history, instead let the new URL replace the current URL. (This effectively removes the current URL from the browser history). */
    overwriteLastHistoryEntry = false
  } = {}
): Promise<void> {
  assertUsage(
    isBrowser(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
  assertUsage(
    globalObject.navigate,
    'navigate() is only available when using Client Routing, see https://vite-plugin-ssr.com/navigate'
  )
  assertUsage(url, '[navigate(url)] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.'
  )
  assertUsage(
    typeof keepScrollPosition === 'boolean',
    '[navigate(url, { keepScrollPosition })] Argument `keepScrollPosition` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof keepScrollPosition +
      '"`.'
  )
  assertUsage(
    typeof overwriteLastHistoryEntry === 'boolean',
    '[navigate(url, { overwriteLastHistoryEntry })] Argument `overwriteLastHistoryEntry` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof overwriteLastHistoryEntry +
      '"`.'
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.')
  await globalObject.navigate(url, { keepScrollPosition, overwriteLastHistoryEntry })
}

function defineNavigate(navigate_: typeof navigate) {
  globalObject.navigate = navigate_
}
