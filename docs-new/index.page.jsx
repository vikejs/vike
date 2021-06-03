import './index.css'
import React from 'react'
import { SidePanel } from './SidePanel'
import { Header } from './Header'
import { Features } from './Features'
import Docs from './Docs.mdx'

export { Page }

function Page() {
  return (
    <Layout>
      <SidePanel />
      <div>
        <Header />
        <Features />
        <Docs />
      </div>
    </Layout>
  )
}

function Layout({ children }) {
  const left = children[0]
  const right = children[1]
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div style={{ flexShrink: 0, overflowY: 'auto', height: '100vh', width: 300 }}>
        <div style={{ /*height: '100vh',*/ position: 'fixed', top: 0 }}>{left}</div>
      </div>
      <div>{right}</div>
    </div>
  )
}
