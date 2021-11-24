import { Component } from 'solid-js'
import logo from './logo.svg'
import './PageLayout.css'

export { PageLayout }

const PageLayout: Component = (props) => {
  return (
    <Layout>
      <Sidebar>
        <Logo />
        <a class="navitem" href="/">
          Home
        </a>
        <a class="navitem" href="/about">
          About
        </a>
      </Sidebar>
      <Content>{props.children}</Content>
    </Layout>
  )
}

const Layout: Component = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        'max-width': '900px',
        margin: 'auto',
      }}
    >
      {props.children}
    </div>
  )
}

const Sidebar: Component = (props) => {
  return (
    <div
      style={{
        padding: '20px',
        'flex-shrink': 0,
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'line-height': '1.8em',
      }}
    >
      {props.children}
    </div>
  )
}

const Content: Component = (props) => {
  return (
    <div
      style={{
        padding: '20px',
        'padding-bottom': '50px',
        'border-left': '2px solid #eee',
        'min-height': '100vh',
      }}
    >
      {props.children}
    </div>
  )
}

const Logo: Component = () => {
  return (
    <div
      style={{
        'margin-top': '20px',
        'margin-bottom': '10px',
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  )
}
