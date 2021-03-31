import { getUrl } from './getUrl.client';
import { parseUrl } from '../utils'

let urlOriginal = getUrlPathname()
let navigated = false

function getUrlPathname() {
  const url = getUrl()
  if (url === null) return null
  return parseUrl(url).pathname
}

export default {
  get navigated() {
    return navigated;
  },
  set navigated(value) {
    navigated = value;
  },
  get urlOriginal() {
    return urlOriginal
  },
  get isInitialRoute() {
    return getUrlPathname() !== urlOriginal || navigated
  }
}