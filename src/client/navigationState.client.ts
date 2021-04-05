import { getUrlPathname } from './getUrl.client'

let urlOriginal = getUrlPathname();

export const navigationState = {
  get isFirstNavigation() {
    return this.checkIfOriginalUrl(this.urlNow);
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
