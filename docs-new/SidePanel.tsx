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

type ScreenBegin = { heading: Heading; boundaryPosition: number }
type ScreenEnd = { heading: Heading; boundaryPosition: number }

function setNavigationScrollWindow() {
  let screenBegin: ScreenBegin | null = null
  let screenEnd: ScreenEnd | null = null
  let previousHeading: Heading | null = null
  let previousTop: number | null = null

  const computeBoundaryBegin = (previousTop: number, top: number) => (0 - previousTop) / (top - previousTop)
  const computeBoundaryEnd = (previousTop: number, top: number) =>
    (window.innerHeight - previousTop) / (top - previousTop)

  for (const heading of headings) {
    const top = getHeadingPosition(heading)
    if (top === null) continue
    if (!screenBegin && top > 0) {
      assert(previousHeading !== null) // The first heading is `Introduction` which has `top <= 0`
      assert(previousTop !== null)
      assert(previousTop <= 0)
      const boundaryPosition = computeBoundaryBegin(previousTop, top)
      screenBegin = { heading: previousHeading, boundaryPosition }
      assertBoundaryPosition(screenBegin.boundaryPosition)
    }
    if (top > window.innerHeight) {
      assert(previousHeading !== null)
      assert(previousTop !== null)
      assert(previousTop <= window.innerHeight)
      const boundaryPosition = computeBoundaryEnd(previousTop, top)
      screenEnd = { heading: previousHeading, boundaryPosition }
      assertBoundaryPosition(screenEnd.boundaryPosition)
      break
    }
    previousHeading = heading
    previousTop = top
  }
  assert(previousHeading)
  assert(previousTop !== null)
  if (!screenBegin) {
    const top = document.body.clientHeight - scrollY
    const boundaryPosition = computeBoundaryBegin(previousTop, top)
    screenBegin = { heading: previousHeading, boundaryPosition }
    assertBoundaryPosition(screenBegin.boundaryPosition)
  }
  if (!screenEnd) {
    // Wenn scrolled all the way down: `scrollY + innerHeight === document.body.clientHeight`
    const top = document.body.clientHeight - scrollY
    const boundaryPosition = computeBoundaryEnd(previousTop, top)
    screenEnd = { heading: previousHeading, boundaryPosition }
    assertBoundaryPosition(screenEnd.boundaryPosition)
  }
  /*
  console.log(
    screenBegin.heading.title,
    screenBegin.boundaryPosition,
    screenEnd.heading.title,
    screenEnd.boundaryPosition
  )
  console.log(screenEnd.boundaryPosition - screenBegin.boundaryPosition)
  //*/
  //document.querySelectorAll('h1, h2, h3, h4')
  updateScrollOverlay(screenBegin, screenEnd)
  setActiveHeadings(screenBegin, screenEnd)
}

function assertBoundaryPosition(boundaryPosition: number) {
  assert(0 <= boundaryPosition && boundaryPosition <= 1)
}

function setActiveHeadings(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
  headings.forEach((heading, idx) => {
    const isActive = headings.indexOf(screenBegin.heading) <= idx && idx <= headings.indexOf(screenEnd.heading) + 1
    const navItem = findNavItem(heading)
    navItem.classList[isActive? 'add' : 'remove']('is-active')
  })
}

function findNavItem(heading: Heading): HTMLElement {
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
  const getOffsetY = (el: HTMLElement) => {
    let offsetY = el.offsetTop
    const parentEl = el.offsetParent as HTMLElement
    if (parentEl !== navigationEl) {
      offsetY += getOffsetY(parentEl)
    }
    return offsetY
  }
  const beginEl = findNavItem(screenBegin.heading)
  const endEl = findNavItem(screenEnd.heading)
  const beginOffsetY = getOffsetY(beginEl)
  const endOffsetY = getOffsetY(endEl)
  const scrollOverlayBegin = beginOffsetY + beginEl.clientHeight * screenBegin.boundaryPosition
  const scrollOverlayEnd = endOffsetY + endEl.clientHeight * screenEnd.boundaryPosition
  const top = scrollOverlayBegin
  const h = Math.ceil(scrollOverlayEnd - scrollOverlayBegin)
  const height = Math.max(1, h)
  //console.log(beginEl, beginOffsetY, endEl, endOffsetY, top, height)
  //console.log('h', h, height, screenBegin.boundaryPosition, screenEnd.boundaryPosition)
  setScrollOverlay(top, height)
}

function getHeadingPosition(heading: Heading): number | null {
  const { id } = heading
  if (id === '') return -scrollY
  assert(id)
  const el = document.getElementById(id)
  if (!el) return null
  const { top } = el.getBoundingClientRect()
  return top
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

function setScrollOverlay(top: number, height: number) {
  const scrollOverlayEl = document.getElementById('scroll-overlay')!
  scrollOverlayEl.style.top = top + 'px'
  scrollOverlayEl.style.height = height + 'px'
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
