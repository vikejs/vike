export { render }
export { Design2 as Page }

import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Title } from './index/Header'
import iconPlugin from '../images/icons/vite-plugin-ssr.svg'
import '@brillout/docpress/renderer/_default.page.client.css'
import '@brillout/docpress/renderer/_default.page.server.css'

type PageContext = {
  Page: () => React.ReactElement
}

function render(pageContext: PageContext) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(<Page />)
  return escapeInject`<html><body><div>${dangerouslySkipEscape(pageHtml)}</div></body></html>`
}

function Design2() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <img width="260" src={iconPlugin} style={{ marginRight: 60, marginTop: 19 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <span style={{ fontSize: '5.3em', display: 'inline-block', verticalAlign: 'middle' }}>
                <Title />
              </span>
            </div>
            <div style={{ fontSize: '2.0em', paddingLeft: 4, paddingTop: 26, paddingBottom: 0 }}>
              <p id="header-tagline">
                Like Next.js/Nuxt but as
                <br />
                do-one-thing-do-it-well
                <br />
                Vite plugin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Design1() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ display: 'flex' }}>
          <img width="180" src={iconPlugin} style={{ verticalAlign: 'middle', marginRight: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <span style={{ fontSize: '5.2em', display: 'inline-block', verticalAlign: 'middle' }}>
                <Title />
              </span>
            </div>
            <div style={{ fontSize: '2.1em', paddingTop: 20, paddingBottom: 20 }}>
              <p id="header-tagline">
                Like Next.js/Nuxt but as
                <br />
                do-one-thing-do-it-well
                <br />
                Vite plugin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
