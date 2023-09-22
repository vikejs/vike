import { dangerouslySkipEscape } from 'vike/server'
export function render() {
  return dangerouslySkipEscape('<html><body><p>hello</p></body></html>')
}
