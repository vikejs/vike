import { dangerouslySkipEscape } from 'vike/server'
export default function () {
  return dangerouslySkipEscape('<html><body><p>hello</p></body></html>')
}
