// https://vike.dev/onRenderClient
export { onRenderClient }

import { render } from 'solid-js/web'
import type { OnRenderClientAsync } from 'vike/types'

/**
 * A function that disposes previously rendered pages.
 *
 * If the function is not executed, each route change will
 * append a page to the DOM without clearing (disposing)
 * the previous one.
 */
let disposePreviousPage: () => void

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page } = pageContext

  if (disposePreviousPage) {
    disposePreviousPage()
  }

  // render the page and save the dispose function of that page
  disposePreviousPage = render(() => <Page />, document.getElementById('root'))
}
