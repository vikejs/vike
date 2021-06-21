import './index.css'
import React from 'react'
import { SidePanel } from './SidePanel'
import { Header } from './Header'
import { Heading } from './types'
import { Features } from './Features'
import Docs from './Docs.mdx'
import { MDXProvider } from '@mdx-js/react'
import { getHeadingId } from './utils'

export { Page }

const sections: Heading[] = [
  /*
  { level: 1, title: 'Introduction', id: '' },
  { level: 1, title: 'Table of Contents' },
  {
    level: 1,
    title: 'Get Started',
    sections: [
      { level: 2, title: 'Tour' },
      { level: 2, title: 'Boilerplates' },
      { level: 2, title: 'Manual Install' }
    ]
  },
  { level: 1, title: 'Guides' },
  { level: 2, title: 'Routing' },
  { level: 2, title: 'Pre-rendering' },
  { level: 1, title: 'API' }
  */
]

/*
const headerWithId = (headerTag: string) => (props: Record<string, any>) => {
  let title = props.children
  if (Array.isArray(title)) {
    title = title[0]
  }
  if (typeof title === 'string') {
    const id = getHeadingId({ title })
    props = { id, ...props }
    const level = parseInt(headerTag.slice(1), 10) - 1
    const lastHeading = sections[sections.length - 1]
    const section = { title, level }
    //console.log(section)
    if (lastHeading && level > lastHeading.level) {
      lastHeading.sections = lastHeading.sections || []
      lastHeading.sections.push(section)
    } else {
      sections.push(section)
    }
  } else {
    // console.log(props.children)
  }
  return React.createElement(headerTag, props)
}

const components = {
  h1: headerWithId('h1'),
  h2: headerWithId('h2'),
  h3: headerWithId('h3')
}
*/

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
        <Header />
        <Features style={{ padding: '0 20px' }}/>
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
