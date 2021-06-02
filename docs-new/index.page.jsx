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
        //flexDirection: 'column'
      }}
    >
      <div style={{ flexShrink: 0 }}>{left}</div>
      <div>{right}</div>
    </div>
  )
}
