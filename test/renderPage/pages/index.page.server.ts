import { dangerouslySkipEscape } from 'vite-plugin-ssr'
export function render() {
  return dangerouslySkipEscape('<html><body>hello</body></html>')
}
