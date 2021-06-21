import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { Heading } from './types'
import { assert } from './utils'
import { headings as headingsCrawled } from './Docs.mdx'

const headings = [
  {
    level: 2,
    title: 'Introduction',
    id: ''
  },
  ...headingsCrawled
]

export { SidePanel }

if (typeof window !== 'undefined') {
  window.addEventListener('load', setNavigationScrollWindow)
  window.onload = setNavigationScrollWindow
  setTimeout(setNavigationScrollWindow, 0)
  window.addEventListener('scroll', setNavigationScrollWindow, { passive: true })
  window.addEventListener('resize', setNavigationScrollWindow, { passive: true })
}

type DocSection = { heading: Heading; boundaryPosition: number; viewportPercentage: number }
type ScreenBegin = DocSection
type ScreenEnd = DocSection

function setNavigationScrollWindow() {
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
    const boundaryPosition = getBoundaryBegin(headingPreviousViewportPosition, headingViewportPosition)
    assertBoundaryPosition(boundaryPosition)
    const viewportPercentage = headingViewportPosition / viewportHeight
    return { heading: headingPrevious, boundaryPosition, viewportPercentage }
  }
  const getScreenEnd = (headingViewportPosition: number) => {
    const boundaryPosition = getBoundaryEnd(headingPreviousViewportPosition, headingViewportPosition)
    const viewportPercentage = (viewportHeight - screenBegin.viewportPercentage) / viewportHeight
    screenEnd = { heading: headingPrevious, boundaryPosition, viewportPercentage }
    assertBoundaryPosition(screenEnd.boundaryPosition)
  }

  for (const heading of headings) {
    const headingViewportPosition = getHeadingPosition(heading)
    if (headingViewportPosition === null) continue
    // `headingViewportPosition > 0` => heading is within viewport
    if (!screenBegin && headingViewportPosition > 0) {
      assert(headingPrevious !== null) // The first heading is `Introduction` which has `headingViewportPosition <= 0`
      assert(headingPreviousViewportPosition !== null)
      assert(headingPreviousViewportPosition <= 0)
      screenBegin = getScreenBegin(headingPrevious, headingViewportPosition)
    }
    if (headingViewportPosition > viewportHeight) {
      assert(screenBegin)
      assert(headingPrevious !== null)
      assert(headingPreviousViewportPosition !== null)
      assert(headingPreviousViewportPosition <= viewportHeight)
      screenEnd = getScreenEnd(headingViewportPosition)
      break
    }
    headingPrevious = heading
    headingPreviousViewportPosition = headingViewportPosition
  }
  assert(headingPrevious)
  assert(headingPreviousViewportPosition !== null)
  if (!screenBegin) {
    const headingViewportPosition = document.body.clientHeight - scrollY
    screenBegin = getScreenBegin(headingPrevious, headingViewportPosition)
  }
  if (!screenEnd) {
    // When scrolled all the way down: `scrollY + viewportHeight === document.body.clientHeight`
    const headingViewportPosition = document.body.clientHeight - scrollY
    screenEnd = getScreenEnd(headingViewportPosition)
  }
  assert(screenBegin && screenEnd)
  //*
  console.log('screenBegin', screenBegin.heading.title, screenBegin.boundaryPosition)
  console.log('screenEnd', screenEnd.heading.title, screenEnd.boundaryPosition)
  console.log(screenEnd.boundaryPosition - screenBegin.boundaryPosition)
  //*/
  updateScrollOverlay(screenBegin, screenEnd)
  setActiveHeadings(screenBegin, screenEnd)
}

function assertBoundaryPosition(boundaryPosition: number) {
  assert(0 <= boundaryPosition && boundaryPosition <= 1)
}

function setActiveHeadings(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
  headings.forEach((heading, idx) => {
    const isActive = headings.indexOf(screenBegin.heading) <= idx && idx <= headings.indexOf(screenEnd.heading) + 1
    const navItem = findNavLink(heading)
    navItem.classList[isActive ? 'add' : 'remove']('is-active')
  })
}

function findNavLink(heading: Heading): HTMLElement {
  const { id } = heading
  assert(typeof id === 'string')
  const navigationEl = getNavigationEl()
  const el: HTMLElement | null = navigationEl.querySelector(`a[href="#${id}"]`)
  assert(el)
  return el
}

let _navigationEl: HTMLElement
function getNavigationEl(): HTMLElement {
  _navigationEl = _navigationEl || document.getElementById('navigation')
  assert(_navigationEl)
  return _navigationEl
}

function updateScrollOverlay(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
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
  const overlayHeight = Math.max(1, Math.ceil(overlayEnd - overlayBegin))
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
        background: `linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 100%,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 100% 100%`,
        backgroundColor: 'rgba(0,0,0,0.03)',
        backgroundRepeat: 'no-repeat',

        backgroundSize: '10px 10px'
      }}
    />
  )
}

/*
function traverse(headings: Heading[]): Heading[] {
  const headingList: Heading[] = []
  headings.forEach((heading) => {
    headingList.push(heading)
    if (heading.headings) {
      headingList.push(...traverse(heading.headings))
    }
  })
  return headingList
}
*/
function NavTree({ headings }: { headings?: Heading[] }) {
  if (headings === undefined) return null
  return (
    <>
      {headings.map((heading) => {
        const { level, title /*, headings*/ } = heading
        const headings: Heading[] = [] /// TODO
        assert(typeof heading.id === 'string')
        return (
          <div key={title}>
            <a className={'nav-item nav-item-h' + level} href={'#' + heading.id}>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </a>
            <NavTree headings={headings} />
          </div>
        )
      })}
    </>
  )
}
