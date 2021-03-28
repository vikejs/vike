import { route, getPageIds } from '../route.node'
import { assert, assertInfo, assertUsage, urlToFile } from '../utils'
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
  document.addEventListener('click', onClick)

  return

  // Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

  function onClick(ev: MouseEvent) {
    if (!isNormalLeftClick(ev)) return

    const linkTag = findLinkTag(ev.target as HTMLElement)
    if (!linkTag) return
    if (!isNotNewTabLink(linkTag)) return

    const url = linkTag.getAttribute('href')
    if (!url) return
    if (isExternalLink(url)) return
    if (isHashLink(url)) return

    ev.preventDefault()
    callback(url)
  }

  function isExternalLink(url: string) {
    return !url.startsWith('/') && !url.startsWith('.')
  }

  function isHashLink(url: string) {
    return url.startsWith('#') || url.startsWith(`${window.location.pathname}#`)
  }

  function isNotNewTabLink(linkTag: HTMLElement) {
    const target = linkTag.getAttribute('target')
    const rel = linkTag.getAttribute('rel')
    return (
      target !== '_blank' &&
      target !== '_external' &&
      rel !== 'external' &&
      !linkTag.hasAttribute('download')
    )
  }

  function isNormalLeftClick(ev: MouseEvent): boolean {
    return (
      ev.button === 0 &&
      !ev.ctrlKey &&
      !ev.shiftKey &&
      !ev.altKey &&
      !ev.metaKey
    )
  }

  function findLinkTag(target: HTMLElement): null | HTMLElement {
    while (target.tagName !== 'A') {
      const { parentNode } = target
      if (!parentNode) {
        return null
      }
      target = parentNode as HTMLElement
    }
    return target
  }
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
  const response = await fetch(`${urlToFile(url)}.pageProps.json`)
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
