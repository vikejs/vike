import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { assert, getHeaderId } from './utils'

export { SidePanel }

if (typeof window !== 'undefined') {
  window.addEventListener('load', setNavigationScrollWindow)
  window.onload = setNavigationScrollWindow
  setTimeout(setNavigationScrollWindow, 0)
  window.addEventListener('scroll', setNavigationScrollWindow, { passive: true })
  window.addEventListener('resize', setNavigationScrollWindow, { passive: true })
}

type ScreenBegin = { header: Header; boundaryPosition: number }
type ScreenEnd = { header: Header; boundaryPosition: number }

function setNavigationScrollWindow() {
  let screenBegin: ScreenBegin | null = null
  let screenEnd: ScreenEnd | null = null
  let previousHeader: Header | null = null
  let previousTop: number | null = null

  const computeBoundaryBegin = (previousTop: number, top: number) => (0 - previousTop) / (top - previousTop)
  const computeBoundaryEnd = (previousTop: number, top: number) => (window.innerHeight - previousTop) / (top - previousTop)

  for (const header of traverse(headers)) {
    const top = getHeaderTop(header)
    if (top === null) continue
    if (!screenBegin && top > 0) {
      assert(previousHeader !== null) // The first header is `Introduction` which has `top <= 0`
      assert(previousTop !== null)
      assert(previousTop <= 0)
      const boundaryPosition = computeBoundaryBegin(previousTop, top)
      screenBegin = { header: previousHeader, boundaryPosition }
      assertBoundaryPosition(screenBegin.boundaryPosition)
    }
    if (top > window.innerHeight) {
      assert(previousHeader !== null)
      assert(previousTop !== null)
      assert(previousTop <= window.innerHeight)
      const boundaryPosition = computeBoundaryEnd(previousTop, top)
      screenEnd = { header: previousHeader, boundaryPosition }
      assertBoundaryPosition(screenEnd.boundaryPosition)
      break
    }
    previousHeader = header
    previousTop = top
  }
  assert(previousHeader)
  assert(previousTop !== null)
  if (!screenBegin) {
    const top = document.body.clientHeight - scrollY
    const boundaryPosition = computeBoundaryBegin(previousTop, top)
    screenBegin = { header: previousHeader, boundaryPosition }
    assertBoundaryPosition(screenBegin.boundaryPosition)
  }
  if (!screenEnd) {
    // Wenn scrolled all the way down: `scrollY + innerHeight === document.body.clientHeight`
    const top = document.body.clientHeight - scrollY
    const boundaryPosition = computeBoundaryEnd(previousTop, top)
    screenEnd = { header: previousHeader, boundaryPosition }
    assertBoundaryPosition(screenEnd.boundaryPosition)
  }
  /*
  console.log(
    screenBegin.header.title,
    screenBegin.boundaryPosition,
    screenEnd.header.title,
    screenEnd.boundaryPosition
  )
  console.log(screenEnd.boundaryPosition - screenBegin.boundaryPosition)
  //*/
  //document.querySelectorAll('h1, h2, h3, h4')
  updateScrollOverlay(screenBegin, screenEnd)
}

function assertBoundaryPosition(boundaryPosition: number) {
  assert(0 <= boundaryPosition && boundaryPosition <= 1)
}

function updateScrollOverlay(screenBegin: ScreenBegin, screenEnd: ScreenEnd) {
  assertBoundaryPosition(screenBegin.boundaryPosition)
  assertBoundaryPosition(screenEnd.boundaryPosition)

  const navigationEl = document.getElementById('navigation')!
  const getNavItem = (link: string): HTMLElement => {
    const el: HTMLElement = navigationEl.querySelector(`a[href="#${link}"]`)!
    //console.log(navigationEl, el, link)
    assert(el)
    return el
  }
  const getOffsetY = (el: HTMLElement) => {
    let offsetY = el.offsetTop
    const parentEl = el.offsetParent as HTMLElement
    if (parentEl !== navigationEl) {
      offsetY += getOffsetY(parentEl)
    }
    return offsetY
  }
  const beginEl = getNavItem(getHeaderId(screenBegin.header)!)
  const endEl = getNavItem(getHeaderId(screenEnd.header)!)
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

function getHeaderTop(header: Header): number | null {
  const id = getHeaderId(header)
  if (id === '') return -scrollY
  assert(id)
  const el = document.getElementById(id)
  if (!el) return null
  const { top } = el.getBoundingClientRect()
  return top
}

type Header = {
  title: string
  level: number
  id?: string
  headers?: Header[]
}

function traverse(headers: Header[]): Header[] {
  const headersFlattened: Header[] = []
  headers.forEach((header) => {
    headersFlattened.push(header)
    if (header.headers) {
      headersFlattened.push(...traverse(header.headers))
    }
  })
  return headersFlattened
}

const headers: Header[] = [
  { level: 1, title: 'Introduction', id: '' },
  { level: 1, title: 'Table of Contents' },
  {
    level: 1,
    title: 'Get Started',
    headers: [
      { level: 2, title: 'Tour' },
      { level: 2, title: 'Boilerplates' },
      { level: 2, title: 'Manual Install' }
    ]
  },
  { level: 1, title: 'Guides' },
  { level: 2, title: 'Routing' },
  { level: 2, title: 'Pre-rendering' },
  { level: 1, title: 'API' }
]

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
      <NavTree headers={headers} />
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

function NavTree({ headers }: { headers?: Header[] }) {
  if (headers === undefined) return null
  return (
    <>
      {headers.map((header) => {
        const { level, title, headers } = header
        return (
          <div key={title}>
            <a className={'nav-h' + level} href={'#' + getHeaderId(header)}>
              {title}
            </a>
            <NavTree headers={headers} />
          </div>
        )
      })}
    </>
  )
}
