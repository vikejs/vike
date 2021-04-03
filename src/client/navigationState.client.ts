import { parseUrl } from '../utils'
import { getUrl } from './getUrl.client'

let urlOriginal = getUrlPathname()
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get isFirstNavigation() {
    return !navigationChanged && this.urlNow === this.urlOriginal
  },
  get urlOriginal() {
    return urlOriginal
  },
  get urlNow() {
    return getUrlPathname()
  }
}

function getUrlPathname() {
  const url = getUrl()
  if (url === null) return null
  return parseUrl(url).pathname
}
