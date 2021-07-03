import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'
import 'highlight.js/styles/stackoverflow-light.css'
import { Heading } from './infra/headings'

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
      href="/"
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
  return (
    <>
      {headings.map((heading) => {
        return (
          <a
            className={'nav-item nav-item-h' + heading.level + (heading.isActive ? ' is-active' : '')}
            href={heading.url || undefined}
          >
            {/*
            <span dangerouslySetInnerHTML={{ __html: title }} />
            */}
          <div>
            {heading.titleInNav || heading.title}
          </div>
          <div className="title-addendum">
            {heading.titleAddendum}
          </div>
          </a>
        )
      })}
    </>
  )
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
