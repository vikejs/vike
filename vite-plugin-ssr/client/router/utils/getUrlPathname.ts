export { getUrlPathname }

import { parseUrl } from '../../utils'

function getUrlPathname(url: string): string {
  const urlPathname = parseUrl(url, '/').pathname
  return urlPathname
}
