import React from 'react'
import { NavigationHeader } from './NavigationHeader'
import { Heading } from '../headings'
/* Won't work this this file is loaded only on the server
import './Navigation.css'
import 'highlight.js/styles/stackoverflow-light.css'
*/

export { Navigation }

function Navigation({ headings }: { headings: Heading[] }) {
  return (
    <>
      <div id="navigation-container" style={{ flexShrink: 0, borderRight: '1px solid #eee' }}>
        <NavigationHeader />
        <div id="navigation-content" style={{ position: 'relative' }}>
          {headings.map((heading, i) => {
            return (
              <a
                className={'nav-item nav-item-h' + heading.level + (heading.isActive ? ' is-active' : '')}
                href={heading.url || undefined}
                key={i}
              >
                <div className="nav-item-title">{heading.titleInNav || heading.title}</div>
                {heading.titleAddendum && <div className="nav-item-addendum">{heading.titleAddendum}</div>}
              </a>
            )
          })}
          {/*
      <ScrollOverlay />
      */}
        </div>
      </div>
      <div id="navigation-mask" />
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
