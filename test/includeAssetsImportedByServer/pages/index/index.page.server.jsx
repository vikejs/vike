import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import logo1Url from './logo-1.svg?url'
import logo2Url from './logo-2.svg?raw'
export async function render() {
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <img src="${logo1Url}" />
        ${dangerouslySkipEscape(logo2Url)}
      </body>
    </html>`
}
