import { getCurrentUrl } from './utils'

const urlOriginal = getCurrentUrl()
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get noNavigationChangeYet() {
    return !navigationChanged && this.isOriginalUrl(getCurrentUrl())
  },
  isOriginalUrl(url: string) {
    return url === urlOriginal
  },
}
