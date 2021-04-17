import { getUrl } from './getUrl.client'

const urlOriginal = getUrl()
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get noNavigationChangeYet() {
    return !navigationChanged && this.isOriginalUrl(getUrl())
  },
  isOriginalUrl(url: string) {
    return url === urlOriginal
  }
}
