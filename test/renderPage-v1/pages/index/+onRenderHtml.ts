import { dangerouslySkipEscape } from 'vite-plugin-ssr/server'
export default function () {
  return dangerouslySkipEscape('<html><body><p>hello</p></body></html>')
}
