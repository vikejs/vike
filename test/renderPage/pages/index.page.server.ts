import { dangerouslySkipEscape } from 'vite-plugin-ssr'
export function render() {
  return dangerouslySkipEscape('<html><body><p>hello</p></body></html>')
}
