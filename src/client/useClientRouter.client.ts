import { route, getPageIds } from '../route.node'
import { assert, assertInfo, assertUsage } from '../utils'
import { getPage } from './getPage.client'
import { setPageInfoRetriever } from './getPageInfo.client'
import { getUrl } from './getUrl.client'
import { parse } from '@brillout/json-s'

export { useClientRouter }
export { navigate }

let isAlreadyCalled: boolean = false
let isFirstPageRender: boolean = true
const urlOriginal = getUrl()

function useClientRouter({
  render,
  onTransitionStart,
  onTransitionEnd
}: {
  render: ({
    Page,
    pageProps,
    isHydration
  }: {
    Page: any
    pageProps: Record<string, any>
    isHydration: boolean
  }) => Promise<void> | void
  onTransitionStart: () => void
  onTransitionEnd: () => void
}): {
  hydrationPromise: Promise<void>
} {
  assertUsage(
    isAlreadyCalled === false,
    '`useClientRouter` can be called only once.'
  )
  isAlreadyCalled = true
  setPageInfoRetriever(retrievePageInfo)

  onLinkClick((url: string) => {
    changeUrl(url)
    fetchAndRender()
  })
  navigateFunction = (url: string) => {
    changeUrl(url)
    return fetchAndRender()
  }
  onBrowserNavigation(() => {
    fetchAndRender()
  })

  let resolveInitialPagePromise: () => void
  const hydrationPromise = new Promise<void>(
    (resolve) => (resolveInitialPagePromise = resolve)
  )

  let callCount = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender()

  return { hydrationPromise }

  async function fetchAndRender(): Promise<undefined> {
    const callNumber = ++callCount
    const urlNew = getUrl()

    if (!isFirstPageRender) {
      if (isTransitioning === false) {
        onTransitionStart()
        isTransitioning = true
      }
    }

    const { Page, pageProps } = await getPage()

    if (renderPromise) {
      // Always make sure that the previous render has finished,
      // otherwise that previous render may finish after this one.
      await renderPromise
    }

    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }

    assert(urlNew === getUrl())
    const isHydration = isFirstPageRender && urlNew === urlOriginal

    assert(renderPromise === undefined)
    renderPromise = (async () => {
      await render({ Page, pageProps, isHydration })
    })()
    await renderPromise
    renderPromise = undefined

    if (isFirstPageRender) {
      resolveInitialPagePromise()
    } else if (callNumber === callCount) {
      onTransitionEnd()
      isTransitioning = false
    }
    isFirstPageRender = false
  }
}

let navigateFunction: (url: string) => Promise<void>
function navigate(url: string): Promise<void> {
  assertUsage(url, '[`navigate(url)`] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[`navigate(url)`] Argument `url` should be a string (but we got `typeof url === "' +
      typeof url +
      '"`.'
  )
  assertUsage(
    url.startsWith('/'),
    '[`navigate(url)`] Argument `url` should start with a leading `/`.'
  )
  return navigateFunction(url)
}

function onLinkClick(callback: (url: string) => void) {
  document.addEventListener('click', (ev) => {
    let target = ev.target as HTMLElement
    while (target.tagName !== 'A') {
      const { parentNode } = target
      if (!parentNode) {
        return
      }
      target = parentNode as HTMLElement
    }
    if (target.tagName === 'A') {
      const url = target.getAttribute('href')
      if (url && (url.startsWith('/') || url.startsWith('.'))) {
        ev.preventDefault()
        callback(url)
      }
    }
  })
}

function onBrowserNavigation(callback: Function) {
  window.addEventListener('popstate', () => {
    callback()
  })
}

function changeUrl(url: string) {
  if (getUrl() === url) return
  window.history.pushState(undefined, '', url)
}

function retrievePageInfo(url: string) {
  const pageIdPromise = (async () => {
    const allPageIds = await getPageIds()
    const contextProps = {}
    const routeResult = await route(url, allPageIds, contextProps)
    if (!routeResult) {
      window.location.pathname = url
      assertUsage(false, `Couldn't not find page for URL \`${url}\``)
    }
    const { pageId } = routeResult
    return pageId
  })()
  const pagePropsPromise = retrievePageProps(url)
  return { pageIdPromise, pagePropsPromise }
}
async function retrievePageProps(
  url: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${url !== '/' ? url : '/index'}.pageProps.json`)
  const responseText = await response.text()
  const responseObject = parse(responseText) as
    | { pageProps: Record<string, unknown> }
    | { userError: true }
  assertInfo(
    !('userError' in responseObject),
    `Couldn't get the \`pageProps\` for \`${url}\`: one of your hooks is throwing an error. Check out the server logs.`
  )
  const { pageProps } = responseObject
  assert(pageProps.constructor === Object)
  return pageProps
}
