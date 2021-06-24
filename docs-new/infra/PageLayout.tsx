import './main.css'
import React from 'react'
import { SidePanel } from '../SidePanel'
import { Header } from '../Header'
import { Features } from '../features/Features'
import Docs from '../Docs.mdx'
import '../Docs.css'

export { PageLayout }

function PageLayout() {
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div id="panel-left" style={{ flexShrink: 0, width: 280 }}>
        <div style={{ height: '100vh', position: 'fixed', top: 0, overflowY: 'auto', borderRight: '1px solid #eee' }}>
          <SidePanel />
        </div>
      </div>
      <div>
        <Header style={{ padding: '50px 70px', paddingBottom: 70 }} />
        <Features
          style={{ marginTop: 0, padding: '0 30px' }}
          styleLineTop={{ paddingBottom: 45 }}
          styleLineBottom={{ marginTop: 40, marginBottom: -70 }}
        />
        <div id="docs">
          <Docs />
        </div>
        {/*
        <MDXProvider components={components}>
          <Docs />
        </MDXProvider>
        */}
      </div>
    </div>
  )
}
