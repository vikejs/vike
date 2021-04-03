import { getUrl } from './getUrl.client';
import { parseUrl } from '../utils'

let urlOriginal = getUrlPathname()
let navigated = false

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
  get isInitialUrl() {
    return checkIfInitialUrl();
  },
  checkIfInitialUrl
}

function getUrlPathname() {
  const url = getUrl()
  if (url === null) return null
  return parseUrl(url).pathname
}

function checkIfInitialUrl(url:string|null=getUrlPathname()) {
  return !(url !== urlOriginal || navigated)
}
