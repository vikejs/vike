import './index.css'
import React from 'react'
import { SidePanel } from './SidePanel'
import { Header } from './Header'
import { Features } from './Features'
import Docs from './Docs.mdx'

export { Page }

function Page() {
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
        <Header style={{ padding: '50px 70px', paddingBottom: 50 }} />
        <Features style={{ marginTop: 0, padding: '0 20px'}} styleLine={{paddingBottom: 20}} />
        <div style={{ padding: '0 100px' }}>
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
