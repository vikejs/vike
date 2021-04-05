import { getUrlPathname } from './getUrl.client'

let urlOriginal = getUrlPathname()
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get noNavigationChangeYet() {
    return !navigationChanged && this.isOriginalUrl(this.urlCurrent)
  },
  isCurrentUrl(url: string) {
    return url === this.urlCurrent
  },
  isOriginalUrl(url: string) {
    return url === this.urlOriginal
  },
  get urlOriginal() {
    return urlOriginal
  },
  get urlCurrent() {
    return getUrlPathname()
  }
}
