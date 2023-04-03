import { Component, ParentComponent } from 'solid-js'

import './MainLayout.css'

export const MainLayout: ParentComponent = ({ children }) => {
  return (
    <Layout>
      <Sidebar>
        <a class="navitem" href="/">
          Home
        </a>
        <a class="navitem" href="/about">
          About
        </a>
      </Sidebar>
      <Content>{children}</Content>
    </Layout>
  )
}

const Layout: ParentComponent = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        'max-width': '900px',
        margin: 'auto'
      }}
    >
      {props.children}
    </div>
  )
}

const Sidebar: ParentComponent = (props) => {
  return (
    <div
      style={{
        padding: '20px',
        'flex-shrink': 0,
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'line-height': '1.8em'
      }}
    >
      {props.children}
    </div>
  )
}

const Content: ParentComponent = (props) => {
  return (
    <div
      style={{
        padding: '20px',
        'padding-bottom': '50px',
        'border-left': '2px solid #eee',
        'min-height': '100vh'
      }}
    >
      {props.children}
    </div>
  )
}
