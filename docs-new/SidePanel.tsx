import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import { Heading } from './types'

export { SidePanel }

function SidePanel({ headings }: { headings: Heading[] }) {
  return (
    <>
      <SideHeader />
      <Navigation headings={headings} />
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

function Navigation({ headings }: { headings: Heading[] }) {
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
