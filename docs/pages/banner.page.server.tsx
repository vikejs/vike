// HOW-TO generate a 2600x1300 banner.png
//  - Go to https://vike.dev/banner
//  - Use responsive design preview of Chrome's dev console
//  - Set it to 1300x650 (half of 2600x1300)
//  - Select "Capture Screenshot" in dropdown of the responsive design preview toolbar
//  - Chrome will generate a 2600x1300 PNG

export { render }
export { Page }

import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import './index/Header.css'
import iconPlugin from '../images/icons/vike-vertical.svg'
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

function Page() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          height: 320,
          // Needs to have the right size upon 1300x650 (that's the viewport we use to generate banner.png as explained in the HOW-TO above)
          scale: '1.2'
        }}
      >
        <img src={iconPlugin} style={{ marginRight: 50, marginTop: 0, height: '100%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%' }}>
          <div>
            <span
              style={{
                fontSize: '8.8em',
                display: 'inline-block',
                verticalAlign: 'middle',
                fontWeight: 500,
                lineHeight: '1.1em'
              }}
            >
              Vike
            </span>
          </div>
          <div style={{ fontSize: '4.2em', paddingLeft: 4, paddingTop: 0, paddingBottom: 0, lineHeight: '1.2em' }}>
            Next Generation
            <br />
            Frontend Framework
          </div>
        </div>
      </div>
    </div>
  )
}
