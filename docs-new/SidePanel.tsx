import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { Heading } from './types'
import { assert, isBrowser } from './utils'
import { headings as headingsCrawled } from './Docs.mdx'

const headings = [
  {
    level: 2,
    title: 'Introduction',
    id: ''
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

type DocSection = { heading: Heading; boundaryPosition: number; viewportPercentage: number }
type ScreenBegin = DocSection
type ScreenEnd = DocSection

function updateSidePanelScroll() {
  let screenBegin: ScreenBegin | null = null
  let screenEnd: ScreenEnd | null = null
  let headingPrevious: Heading | null = null
  let headingPreviousViewportPosition: number | null = null

  const viewportHeight = window.innerHeight

  const getBoundaryBegin = (headingPreviousViewportPosition: number, headingViewportPosition: number) =>
    (0 - headingPreviousViewportPosition) / (headingViewportPosition - headingPreviousViewportPosition)
  const getBoundaryEnd = (headingPreviousViewportPosition: number, headingViewportPosition: number) =>
    (viewportHeight - headingPreviousViewportPosition) / (headingViewportPosition - headingPreviousViewportPosition)

  const getScreenBegin = (headingViewportPosition: number) => {
    assert(headingPrevious !== null) // The first heading is `Introduction` which has `headingViewportPosition <= 0`
    assert(headingPreviousViewportPosition !== null)
    assert(headingPreviousViewportPosition <= 0)
    const boundaryPosition = getBoundaryBegin(headingPreviousViewportPosition, headingViewportPosition)
    assertBoundaryPosition(boundaryPosition)
    const viewportPercentage = Math.min(headingViewportPosition, viewportHeight) / viewportHeight
    assert(viewportPercentage >= 0 && viewportPercentage <= 1)
    return { heading: headingPrevious, boundaryPosition, viewportPercentage }
  }
  const getScreenEnd = (headingViewportPosition: number) => {
    assert(headingPrevious !== null)
    assert(headingPreviousViewportPosition !== null)
    assert(headingPreviousViewportPosition <= viewportHeight)
    const boundaryPosition = getBoundaryEnd(headingPreviousViewportPosition, headingViewportPosition)
    assertBoundaryPosition(boundaryPosition)
    assert(screenBegin)
    const viewportPercentage = (viewportHeight - Math.max(headingPreviousViewportPosition, 0)) / viewportHeight
    assert(viewportPercentage >= 0 && viewportPercentage <= 1)
    return { heading: headingPrevious, boundaryPosition, viewportPercentage }
  }

  for (const heading of headings) {
    const headingViewportPosition = getHeadingPosition(heading)
    if (headingViewportPosition === null) continue
    // `headingViewportPosition > 0` => heading is within viewport
    if (!screenBegin && headingViewportPosition > 0) {
      screenBegin = getScreenBegin(headingViewportPosition)
    }
    if (headingViewportPosition > viewportHeight) {
      screenEnd = getScreenEnd(headingViewportPosition)
      break
    }
    headingPrevious = heading
    headingPreviousViewportPosition = headingViewportPosition
  }
  if (!screenBegin) {
    const headingViewportPosition = document.body.clientHeight - scrollY
    screenBegin = getScreenBegin(headingViewportPosition)
  }
  if (!screenEnd) {
    // When scrolled all the way down: `scrollY + viewportHeight === document.body.clientHeight`
    const headingViewportPosition = document.body.clientHeight - scrollY
    screenEnd = getScreenEnd(headingViewportPosition)
  }
  assert(screenBegin && screenEnd)
  /*
  console.log('screenBegin', screenBegin.heading.title, screenBegin.boundaryPosition)
  console.log('screenEnd', screenEnd.heading.title, screenEnd.boundaryPosition)
  console.log(screenEnd.boundaryPosition - screenBegin.boundaryPosition)
  //*/
  setActiveHeadings(screenBegin, screenEnd)
  updateScrollPosition(screenBegin, screenEnd)
}

function assertBoundaryPosition(boundaryPosition: number) {
  assert(0 <= boundaryPosition && boundaryPosition <= 1)
}

function setActiveHeadings(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
  const headingsViewportPercentage = getHeadingsViewportPercentage(screenBegin, screenEnd)
  const viewportPercentageHighest = Math.max(
    ...headingsViewportPercentage.map(({ viewportPercentage }) => viewportPercentage)
  )
  headingsViewportPercentage.forEach((heading) => {
    if (viewportPercentageHighest === heading.viewportPercentage) {
      const navItem = findNavLink(heading)
      updateNavTreeExpendedState(navItem)
    }
  })
  headingsViewportPercentage.forEach((heading) => {
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

type HeadingViewportPercentage = Heading & { viewportPercentage: number }
function getHeadingsViewportPercentage(screenBegin: ScreenBegin, screenEnd: ScreenEnd): HeadingViewportPercentage[] {
  const screenBeginIdx = headings.indexOf(screenBegin.heading)
  const screenEndIdx = headings.indexOf(screenEnd.heading)

  const viewportPercentageLeftover = 1 - (screenBegin.viewportPercentage + screenEnd.viewportPercentage)

  let viewportPercentageTotal = 0

  const headingsViewportPercentage = headings.map((heading, idx) => {
    const isActive = screenBeginIdx <= idx && idx <= screenEndIdx
    if (!isActive) {
      return { ...heading, viewportPercentage: 0 }
    } else {
      const viewportPercentage: number =
        (idx == screenBeginIdx && screenBegin.viewportPercentage) ||
        (idx == screenEndIdx && screenEnd.viewportPercentage) ||
        viewportPercentageLeftover / (screenEndIdx - screenBeginIdx - 1)
      viewportPercentageTotal += viewportPercentage
      assert(viewportPercentage >= 0 && viewportPercentage <= 1)
      return { ...heading, viewportPercentage }
    }
  })

  // console.log('vpt', viewportPercentageTotal, screenBegin.viewportPercentage, screenEnd.viewportPercentage)
  assert(1 - 0.00001 <= viewportPercentageTotal && viewportPercentageTotal <= 1 + 0.00001)

  return headingsViewportPercentage
}

function findNavLink(heading: Heading): HTMLElement {
  const { id } = heading
  assert(typeof id === 'string')
  const navigationEl = getNavigationEl()
  const navLinks: HTMLElement[] = Array.from(navigationEl.querySelectorAll(`a[href="#${id}"]`))
  assert(navLinks.length === 1)
  return navLinks[0]
}

let _navigationEl: HTMLElement
function getNavigationEl(): HTMLElement {
  _navigationEl = _navigationEl || document.getElementById('navigation')
  assert(_navigationEl)
  return _navigationEl
}

function updateScrollPosition(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
  assertBoundaryPosition(screenBegin.boundaryPosition)
  assertBoundaryPosition(screenEnd.boundaryPosition)

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
  const overlayBegin = getOverlayPosition(screenBegin)
  const overlayEnd = getOverlayPosition(screenEnd)
  const overlayHeight = Math.max(1, overlayEnd - overlayBegin)
  const scrollOverlayEl = document.getElementById('scroll-overlay')!
  scrollOverlayEl.style.top = overlayBegin + 'px'
  scrollOverlayEl.style.height = overlayHeight + 'px'
}

function getHeadingPosition(heading: Heading): number | null {
  const { id } = heading
  if (id === '') return -scrollY
  assert(id)
  const el = document.getElementById(id)
  if (!el) return null
  const headingViewportPosition = el.getBoundingClientRect().top
  assert(typeof headingViewportPosition === 'number')
  return headingViewportPosition
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
        const { id, level, title, headingsChildren } = heading
        assert(typeof heading.id === 'string')
        return (
          <div className="nav-tree" key={id || title}>
            <a className={'nav-item nav-item-h' + level} href={'#' + heading.id}>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </a>
            <NavTree headings={headingsChildren} />
          </div>
        )
      })}
    </>
  )
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
  const width = '1px'
  const color = '#aaa'
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
  const ids: string[] = []
  headings.forEach(({ id }) => {
    assert(!ids.includes(id))
    ids.push(id)
  })
}
