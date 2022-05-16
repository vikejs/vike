export { getUrlPathname }

import { parseUrl } from '../../utils'

function getUrlPathname(url: string): string {
  const urlPathname = parseUrl(url, '/').pathnameWithoutBaseUrl
  return urlPathname
}
