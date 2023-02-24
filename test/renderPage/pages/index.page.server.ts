import { dangerouslySkipEscape } from 'vite-plugin-ssr'
export function render() {
  return dangerouslySkipEscape('<html><head><meta charset="utf-8"></head><body><p>hello</p></body></html>')
}
