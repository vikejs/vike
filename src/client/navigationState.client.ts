import { getUrlPathname } from './getUrl.client'

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
