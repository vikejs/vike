import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { assert, getHeaderId } from './utils'

export { SidePanel }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    (ev) => {
      let screenBegin: { header: Header; boundaryPosition: number } | null = null
      let screenEnd: { header: Header; boundaryPosition: number } | null = null
      let previousHeader: Header | null = null
      let previousTop: number | null = null
      for (const header of traverse(headers)) {
        const top = getHeaderTop(header)
        console.log(header, top)
        if (top === null) continue
        if (!screenBegin && top > 0) {
          assert(previousHeader !== null) // The first header is `Introduction` which has `top === 0`
          assert(previousTop !== null)
          assert(previousTop <= 0)
          const boundaryPosition = (0 - previousTop) / (top - previousTop)
          screenBegin = { header: previousHeader, boundaryPosition }
        }
        if (top > window.innerHeight) {
          assert(previousHeader !== null)
          assert(previousTop !== null)
          assert(previousTop <= window.innerHeight)
          const boundaryPosition = (window.innerHeight - previousTop) / (top - previousTop)
          screenEnd = { header: header, boundaryPosition }
          break
        }
        previousHeader = header
        previousTop = top
      }
      assert(previousHeader)
      assert(previousTop)
      if (!screenBegin) {
        const boundaryPosition = (0 - previousTop) / (window.innerHeight - previousTop)
        screenBegin = { header: previousHeader, boundaryPosition }
      }
      if (!screenEnd) {
        const boundaryPosition = (window.innerHeight - previousTop) / (top - previousTop)
        screenEnd = { header: previousHeader, boundaryPosition }
      }
      console.log(screenBegin.header.title, screenBegin.boundaryPosition, screenEnd.header.title, screenEnd.boundaryPosition)
      //document.querySelectorAll('h1, h2, h3, h4')
    },
    { passive: true }
  )
}

function getHeaderTop(header: Header): number | null {
  const id = getHeaderId(header)
  if (id === '') return 0
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
  return <NavTree headers={headers} />
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
