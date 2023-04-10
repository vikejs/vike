export default onRenderHtml

import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import logo1Url from './logo-1.svg?url'
import logo2Url from './logo-2.svg?raw'

async function onRenderHtml() {
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <img src="${logo1Url}" />
        ${dangerouslySkipEscape(logo2Url)}
      </body>
    </html>`
}
