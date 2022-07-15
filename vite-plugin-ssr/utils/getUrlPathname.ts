export { getUrlPathname }

import { parseUrl } from './parseUrl'

function getUrlPathname(url: string): string {
  const urlPathname = parseUrl(url, '/').pathname
  return urlPathname
}
