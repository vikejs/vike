import { assert, assertUsage, hasProp, isNodejs } from '../../utils'
import { getUrl } from '../getUrl.client'
import { getPageByUrl } from './getPageByUrl.client'
import { navigationState } from '../navigationState.client';

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
  assertUsage(isAlreadyCalled === false, '`useClientRouter` can be called only once.')
  isAlreadyCalled = true
  disableBrowserScrollRestoration()
  autoSaveScrollPosition()

  onLinkClick((url: string) => {
    changeUrl(url)
    fetchAndRender(null)
  })
  onBrowserHistoryNavigation((scrollPosition) => {
    fetchAndRender(scrollPosition)
  })
  navigateFunction = async (url: string) => {
    changeUrl(url)
    await fetchAndRender(null)
  }

  let resolveInitialPagePromise: () => void
  const hydrationPromise = new Promise<void>((resolve) => (resolveInitialPagePromise = resolve))

  let callCount = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender()

  return { hydrationPromise }

  async function fetchAndRender(scrollPosition?: ScrollPosition | null): Promise<undefined> {
    const callNumber = ++callCount

    if (!isFirstPageRender) {
      if (isTransitioning === false) {
        onTransitionStart()
        isTransitioning = true
      }
    }

    const urlNow = getUrl()
    const { Page, pageProps } = await getPageByUrl(urlNow, navigationState.isFirstNavigation)

    if (renderPromise) {
      // Always make sure that the previous render has finished,
      // otherwise that previous render may finish after this one.
      await renderPromise
    }

    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }

    assert(urlNow === getUrl())
    const isHydration = isFirstPageRender && urlNow === urlOriginal

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

    if (scrollPosition !== undefined) {
      setScrollPosition(scrollPosition)
    }
  }
}

let navigateFunction: undefined | ((url: string) => Promise<void>)
async function navigate(url: string): Promise<void> {
  assertUsage(
    !isNodejs(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
  assertUsage(url, '[navigate(url)] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.'
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.')
  assertUsage(
    navigateFunction,
    '[navigate()] You need to call `useClientRouter()` before being able to use `navigate()`.'
  )
  await navigateFunction(url)
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
    return target !== '_blank' && target !== '_external' && rel !== 'external' && !linkTag.hasAttribute('download')
  }

  function isNormalLeftClick(ev: MouseEvent): boolean {
    return ev.button === 0 && !ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey
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

function onBrowserHistoryNavigation(callback: (scrollPosition: ScrollPosition | null) => void) {
  window.addEventListener('popstate', (ev) => {
    const scrollPosition = hasProp(ev.state, 'scrollPosition') ? (ev.state.scrollPosition as ScrollPosition) : null
    callback(scrollPosition)
  })
}

function changeUrl(url: string) {
  if (getUrl() === url) return
  navigationState.markNavigationChange()
  window.history.pushState(undefined, '', url)
}

type ScrollPosition = { x: number; y: number }
function getScrollPosition(): ScrollPosition {
  const scrollPosition = { x: window.scrollX, y: window.scrollY }
  return scrollPosition
}
function setScrollPosition(scrollPosition: ScrollPosition | null): void {
  if (!scrollPosition) {
    const hash = getUrlHash()
    // We mirror the browser's native behavior
    if (hash && hash !== 'top') {
      const hashTarget = document.getElementById(hash) || document.getElementsByName(hash)[0]
      if (hashTarget) {
        hashTarget.scrollIntoView()
        return
      }
    }
    scrollPosition = { x: 0, y: 0 }
  }
  const { x, y } = scrollPosition
  window.scrollTo(x, y)
}

function autoSaveScrollPosition() {
  window.addEventListener('scroll', saveScrollPosition, { passive: true })
}
function saveScrollPosition() {
  // Save scroll position
  const scrollPosition = getScrollPosition()
  window.history.replaceState({ scrollPosition }, '')
}

function getUrlHash(): string | null {
  let { hash } = window.location
  if (hash === '') return null
  assert(hash.startsWith('#'))
  hash = hash.slice(1)
  return hash
}

function disableBrowserScrollRestoration() {
  // Prevent browser scroll behavior on History popstate
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
