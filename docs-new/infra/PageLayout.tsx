import './main.css'
import React from 'react'
import { SidePanel } from '../SidePanel'
import { Heading } from '../types'
import '../Docs.css'

export { PageLayout }

function PageLayout({ headings, children }: { headings: Heading[]; children: JSX.Element }) {
  const sidePanelWidth = 280
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div id="panel-left" style={{ flexShrink: 0, width: sidePanelWidth }}>
        <div
          style={{
            height: '100vh',
            width: sidePanelWidth,
            position: 'fixed',
            top: 0,
            overflowY: 'auto',
            borderRight: '1px solid #eee'
          }}
        >
          <SidePanel headings={headings} />
        </div>
      </div>
      <div>
        <div id="docs">{children}</div>
      </div>
    </div>
  )
}
