import { Accessor, Component } from 'solid-js'
import logo from './logo.svg'
import './PageLayout.css'

export { PageLayout }

export interface Route {
  Page: Component
  pageProps: Record<string, unknown>
}

interface Props {
  route: Accessor<Route | null>
}

const PageLayout: Component<Props> = (props) => {
  const renderedRoute = () => {
    const { Page, pageProps } = props.route() ?? {}
    return Page && <Page {...pageProps} />
  }

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
      <Content>{renderedRoute()}</Content>
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
