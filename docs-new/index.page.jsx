import './index.css'
import React from 'react'
import { SidePanel } from './SidePanel'
import { Header } from './Header'
import { Features } from './Features'
import Docs from './Docs.mdx'
import { MDXProvider } from '@mdx-js/react'

export { Page }

const MyH1 = (props) => <h1 className="euh" style={{ color: 'green' }} {...props} />
const MyParagraph = (props) => <p className="euh" style={{ color: 'blue', fontSize: '18px', lineHeight: 1.6 }} />

const components = {
  h1: MyH1,
  h2: MyH1,
  h3: MyH1,
  p: MyParagraph
}

function Page() {
  const docs = (
    <MDXProvider components={components}>
      <Docs components={components} />
    </MDXProvider>
  )

  return (
    <Layout>
      <SidePanel />
      <div>
        <Header />
        <Features />
        {docs}
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
      <div style={{ flexShrink: 0, overflowY: 'auto', height: '100vh', width: 280 }}>
        <div style={{ /*height: '100vh',*/ position: 'fixed', top: 0 }}>{left}</div>
      </div>
      <div style={{ padding: '0 10px' }}>{right}</div>
    </div>
  )
}
