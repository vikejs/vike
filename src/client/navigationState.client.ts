import { getUrlPathname } from './getUrl.client'

let urlOriginal = getUrlPathname();
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get isFirstNavigation() {
    return !navigationChanged && this.checkIfOriginalUrl(this.urlNow);
  },
  checkIfOriginalUrl(url : string) {
    return url === this.urlOriginal;
  },
  get urlOriginal() {
    return urlOriginal
  },
  get urlNow() {
    return getUrlPathname()
  }
}
