import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { Heading } from './types'
import { assert, isBrowser } from './utils'
import { headings as headingsCrawled } from './Docs.mdx'

const headings: Heading[] = [
  {
    level: 2,
    title: 'Overview',
    isDocumentBegin: true
  },
  ...headingsCrawled
]
assert_headings()

export { SidePanel }
export { updateSidePanelScroll }

if (isBrowser()) {
  setTimeout(updateSidePanelScroll, 0)
  window.addEventListener('scroll', updateSidePanelScroll, { passive: true })
  window.addEventListener('resize', updateSidePanelScroll, { passive: true })
}

function updateSidePanelScroll() {
  /*
  const headingSectionsVisibility = getHeadingSectionsVisbility(headings)
  setActiveHeadings(headingSectionsVisibility)
  renderNavScrollBar(headingSectionsVisibility)
  */
}

type HeadingVisible = { heading: Heading; boundaryPosition: number; viewportPercentage: number }
function getVisibleHeadings(
  headingSectionsVisibility: HeadingSectionVisibility[]
): HeadingSectionVisibility[] {
  const headings_withVisibileNavItem: Heading[] = filterHeadingsWithVisibileNavItem(headingSectionsVisibility)
  const headingSectionsWithVisibleNavItemVisibility = getHeadingSectionsVisbility(headings_withVisibileNavItem)
  return headingSectionsWithVisibleNavItemVisibility
}
function getBoundaryHeading(headingSectionsVisibility: HeadingSectionVisibility[]):{ headingVisibleFirst: HeadingVisible; headingVisibleLast: HeadingVisible }  {
  const headingSectionsWithVisibleNavItemVisibility = getVisibleHeadings(headingSectionsVisibility)
  const h: HeadingSectionVisibility[] = headingSectionsWithVisibleNavItemVisibility
  const hFirst = h.find(({ screenBeginPosition }) => screenBeginPosition !== null)
  const hLast = h.find(({ screenEndPosition }) => screenEndPosition !== null)
  assert(hFirst)
  assert(hLast)
  assert(hFirst.screenBeginPosition !== null)
  assert(hLast.screenEndPosition !== null)
  const headingVisibleFirst = {
    heading: hFirst,
    boundaryPosition: hFirst.screenBeginPosition,
    viewportPercentage: hFirst.viewportPercentage
  }
  const headingVisibleLast = {
    heading: hLast,
    boundaryPosition: hLast.screenEndPosition,
    viewportPercentage: hLast.viewportPercentage
  }
  return { headingVisibleFirst, headingVisibleLast }
}

function filterHeadingsWithVisibileNavItem(headingSectionsVisibility: HeadingSectionVisibility[]): Heading[] {
  const hs = headingSectionsVisibility
  const viewportPercentageHighest = Math.max(...hs.map(({ viewportPercentage }) => viewportPercentage))
  const mainHeading = hs.find((heading) => {
    return heading.viewportPercentage === viewportPercentageHighest
  })
  assert(mainHeading)
  const ancestors = getAncestors(mainHeading, hs)
  const headings_withVisibileNavItem = hs.filter((heading) => {
    const p = getParent(heading, hs)
    return p === null || ancestors.includes(p)
  })
  return headings_withVisibileNavItem
}

function getParent(heading: Heading, headings: Heading[]): Heading | null {
  return getAncestors(heading, headings)[0] || null
}

function getAncestors(heading: Heading, headings: Heading[]): Heading[] {
  const headingIndex = headings.indexOf(heading)
  assert(headingIndex >= 0)
  const ancestors: Heading[] = []
  let currentLevel = heading.level - 1
  for (let i = headingIndex - 1; i >= 0; i--) {
    const h = headings[i]
    if (h.level === currentLevel) {
      ancestors.push(h)
      currentLevel--
    }
  }
  assert(currentLevel === 1)
  return ancestors
}

type HeadingSectionVisibility = Heading & {
  viewportPercentage: number
  screenBeginPosition: null | number
  screenEndPosition: null | number
}
function getHeadingSectionsVisbility(headings: Heading[]): HeadingSectionVisibility[] {
  const screenBeginPositionAbsolute = getScrollPosition()
  const screenEndPositionAbsolute = screenBeginPositionAbsolute + getViewportHeight()

  const headingSections: (HeadingSectionVisibility & { beginPosition: number; endPosition: number })[] = []
  headings.forEach((heading, i) => {
    const beginPosition = getHeadingPosition(heading)

    const headingNext = headings[i + 1]
    const endPosition = !headingNext ? getDocumentHeight() : getHeadingPosition(headingNext)

    const sectionHeight = endPosition - beginPosition
    assert(sectionHeight > 0)

    let screenBeginPosition = null
    if (beginPosition <= screenBeginPositionAbsolute && screenBeginPositionAbsolute <= endPosition) {
      screenBeginPosition = (screenBeginPositionAbsolute - beginPosition) / sectionHeight
      assert(0 <= screenBeginPosition && screenBeginPosition <= 1)
    }

    let screenEndPosition = null
    if (beginPosition <= screenEndPositionAbsolute && screenEndPositionAbsolute <= endPosition) {
      screenEndPosition = (screenEndPositionAbsolute - beginPosition) / sectionHeight
      assert(0 <= screenEndPosition && screenEndPosition <= 1)
    }

    assert(beginPosition <= endPosition)
    const getViewportPosition = (position: number) => {
      const viewportPosition = Math.min(Math.max(position, screenBeginPositionAbsolute), screenEndPositionAbsolute)
      assert(screenBeginPositionAbsolute <= viewportPosition && viewportPosition <= screenEndPositionAbsolute)
      return viewportPosition
    }
    const viewportPositionBegin = getViewportPosition(beginPosition)
    const viewportPositionEnd = getViewportPosition(endPosition)
    const viewportPercentage = (viewportPositionEnd - viewportPositionBegin) / getViewportHeight()

    headingSections.push({
      ...heading,
      viewportPercentage,
      screenBeginPosition,
      screenEndPosition,
      beginPosition,
      endPosition
    })
  })

  const viewportPercentageTotal = sum(headingSections.map(({ viewportPercentage }) => viewportPercentage))
  const debugInfo = JSON.stringify({ headingSections, screenBeginPositionAbsolute, screenEndPositionAbsolute }, null, 2)
  assert(viewportPercentageTotal <= 1 + 0.00001, debugInfo)
  // assert(1 - 0.00001 <= viewportPercentageTotal && viewportPercentageTotal <= 1 + 0.00001, debugInfo)
  assert(headingSections.filter(({ screenBeginPosition }) => screenBeginPosition !== null).length === 1, debugInfo)
  assert(headingSections.filter(({ screenEndPosition }) => screenEndPosition !== null).length === 1, debugInfo)

  return headingSections
}

function assertBoundaryPosition(boundaryPosition: number) {
  assert(0 <= boundaryPosition && boundaryPosition <= 1)
}

function setActiveHeadings(headingSectionsVisibility: HeadingSectionVisibility[]) {
  /*
  const viewportPercentageHighest = Math.max(
    ...headingSectionsVisibility.map(({ viewportPercentage }) => viewportPercentage)
  )
  */
  const visibleHeadings = getVisibleHeadings(headingSectionsVisibility)
  // console.log('v', visibleHeadings);
  headingSectionsVisibility.forEach((heading) => {
    const navItem = findNavLink(heading)
    const isVisibile = visibleHeadings.find((visibleHeading) => {
      if( 'isDocumentBegin' in heading || 'isDocumentBegin' in visibleHeading ) {
        return 'isDocumentBegin' in heading && 'isDocumentBegin' in visibleHeading
      } else {
        return heading.id === visibleHeading.id
      }
    })
    navItem.style.display = isVisibile ? 'inherit' : 'none';
    /*
    if (viewportPercentageHighest === heading.viewportPercentage) {
      const navItem = findNavLink(heading)
      updateNavTreeExpendedState(navItem)
    }
    */
  })
  headingSectionsVisibility.forEach((heading) => {
    const navItem = findNavLink(heading)
    setNavItemBackgroundColor(navItem, heading.viewportPercentage)
  })
}

function updateNavTreeExpendedState(navItem: HTMLElement) {
  const navItemHref = navItem.getAttribute('href')
  assert(typeof navItemHref === 'string')
  const selector = `a[href="${navItemHref}"]`
  //console.log(11, selector, 2)
  assert(document.querySelector(selector))
  document.querySelectorAll('.nav-tree').forEach((navTree) => {
    const isExpended = !!navTree.querySelector(selector)
    //console.log(navTree.href, isExpended)
    navTree.classList[isExpended ? 'add' : 'remove']('expanded')
  })
}

function setNavItemBackgroundColor(navItem: HTMLElement, viewportPercentage: number) {
  if (viewportPercentage) {
    assert(viewportPercentage >= 0 && viewportPercentage <= 1)
    const backgroundColor = `rgba(0, 0, 0, ${viewportPercentage / 20})`
    navItem.style.backgroundColor = backgroundColor
  } else {
    navItem.style.backgroundColor = 'transparent'
  }
}

function findNavLink(heading: Heading): HTMLElement {
  const href = getHref(heading)
  const navigationEl = getNavigationEl()
  const navLinks: HTMLElement[] = Array.from(navigationEl.querySelectorAll(`a[href="${href}"]`))
  assert(navLinks.length === 1)
  return navLinks[0]
}

let _navigationEl: HTMLElement
function getNavigationEl(): HTMLElement {
  _navigationEl = _navigationEl || document.getElementById('navigation')
  assert(_navigationEl)
  return _navigationEl
}

function renderNavScrollBar(headingSectionsVisibility: HeadingSectionVisibility[]) {
  const { headingVisibleFirst, headingVisibleLast } = getBoundaryHeading(headingSectionsVisibility)
  assertBoundaryPosition(headingVisibleFirst.boundaryPosition)
  assertBoundaryPosition(headingVisibleLast.boundaryPosition)

  const navigationEl = getNavigationEl()
  const getLinkNavPosition = (el: HTMLElement): number => {
    let offsetY = el.offsetTop
    const parentEl = el.offsetParent as HTMLElement
    if (parentEl !== navigationEl) {
      offsetY += getLinkNavPosition(parentEl)
    }
    return offsetY
  }
  const getOverlayPosition = ({
    heading,
    boundaryPosition
  }: {
    heading: Heading
    boundaryPosition: number
  }): number => {
    const navLink = findNavLink(heading)
    const navLinkPos = getLinkNavPosition(navLink)
    const scrollOverlayBoundaryPos = navLinkPos + navLink.clientHeight * boundaryPosition
    return scrollOverlayBoundaryPos
  }
  const overlayBegin = getOverlayPosition(headingVisibleFirst)
  const overlayEnd = getOverlayPosition(headingVisibleLast)
  const overlayHeight = Math.max(1, overlayEnd - overlayBegin)
  const scrollOverlayEl = document.getElementById('scroll-overlay')!
  scrollOverlayEl.style.top = overlayBegin + 'px'
  scrollOverlayEl.style.height = overlayHeight + 'px'
}

function getHeadingPosition(heading: Heading): number {
  if ('isDocumentBegin' in heading) return 0
  const { id } = heading
  assert(id)
  const el = document.getElementById(id)
  assert(el)

  // `el.getBoundingClientRect()` returns position relative to viewport begin
  // - https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
  const headingPositionRelative = el.getBoundingClientRect().top

  const scrollPosition = getScrollPosition()

  // We add the viewport begin position
  const headingPosition = headingPositionRelative + scrollPosition

  return headingPosition
}
function getDocumentHeight(): number {
  return document.body.clientHeight
}
function getViewportHeight(): number {
  return window.innerHeight
}
function getScrollPosition(): number {
  return window.scrollY
}

function SidePanel() {
  return (
    <>
      <SideHeader />
      <Navigation />
    </>
  )
}

function SideHeader() {
  const SIZE = 50
  return (
    <a
      style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', padding: 20 }}
      href="#"
    >
      <img src={iconPlugin} height={SIZE} width={SIZE} />
      <code
        style={{ backgroundColor: '#f4f4f4', borderRadius: 4, fontSize: '1.35em', padding: '2px 5px', marginLeft: 10 }}
      >
        vite-plugin-ssr
      </code>
    </a>
  )
}

function Navigation() {
  return (
    <div id="navigation" style={{ position: 'relative' }}>
      <NavTree headings={headings} />
      <ScrollOverlay />
    </div>
  )
}
function NavTree({ headings }: { headings: Heading[] }) {
  const headingsTree = getHeadingsTree(headings)
  return (
    <>
      {headingsTree.map((heading) => {
        const { level, title, headingsChildren } = heading
        const key = 'isDocumentBegin' in heading ? 'doc-begin' : heading.id
        const href = getHref(heading)
        return (
          <div className="nav-tree" key={key}>
            <a className={'nav-item nav-item-h' + level} href={href}>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </a>
            <NavTree headings={headingsChildren} />
          </div>
        )
      })}
    </>
  )
}
function getHref(heading: Heading): string {
  const href = 'isDocumentBegin' in heading ? '#' : `#${heading.id}`
  return href
}

type HeadingsRoot = Heading & { headingsChildren: Heading[] }
function getHeadingsTree(headings: Heading[]): HeadingsRoot[] {
  const headingLowestLevel = Math.min(...headings.map(({ level }) => level))
  const headingsRoots: HeadingsRoot[] = []
  headings.forEach((heading) => {
    if (heading.level === headingLowestLevel) {
      headingsRoots.push({
        ...heading,
        headingsChildren: []
      })
    } else {
      headingsRoots[headingsRoots.length - 1].headingsChildren.push(heading)
    }
  })
  return headingsRoots
}

function ScrollOverlay() {
  // const width = '1px'
  // const color = '#aaa'
  return (
    <div
      id="scroll-overlay"
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        left: '0',
        width: '100%',
        /*
        background: `linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 100%,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 100% 100%`,
        //*/
        //borderRight: `5px solid ${color}`,
        borderRight: `3px solid #666`,
        //border: `1px solid ${color}`,
        boxSizing: 'border-box',
        // backgroundColor: 'rgba(0,0,0,0.03)',
        backgroundRepeat: 'no-repeat',

        backgroundSize: '10px 10px'
      }}
    />
  )
}

function assert_headings() {
  const hrefs: string[] = []
  headings.forEach((heading) => {
    const href = getHref(heading)
    assert(!hrefs.includes(href), href)
    hrefs.push(href)
  })
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
