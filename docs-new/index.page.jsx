import './index.css'
import React from 'react'
import { SidePanel } from './SidePanel'
import { Header } from './Header'
import { Features } from './Features'
import Docs from './Docs.mdx'
import { MDXProvider } from '@mdx-js/react'
import { getHeaderId } from './utils'

export { Page }

const headerWithId = (headerTag) => (props) => {
  const title = props.children
  if (typeof title === 'string') {
    const id = getHeaderId({ title })
    props = { id, ...props }
  }
  return React.createElement(headerTag, props)
}

const components = {
  h1: headerWithId('h1'),
  h2: headerWithId('h2'),
  h3: headerWithId('h3')
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
      <div style={{ flexShrink: 0, width: 280 }}>
        <div style={{ height: '100vh', position: 'fixed', top: 0, overflowY: 'auto', borderRight: '1px solid #eee' }}>
          {left}
        </div>
      </div>
      <div style={{ padding: '0 10px' }}>{right}</div>
    </div>
  )
}
