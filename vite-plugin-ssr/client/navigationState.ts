import { getCurrentUrl } from './utils'

const urlFirst = getCurrentUrl()
let navigationChanged = false

export const navigationState = {
  markNavigationChange() {
    navigationChanged = true
  },
  get noNavigationChangeYet() {
    return !navigationChanged && this.isFirstUrl(getCurrentUrl())
  },
  isFirstUrl(url: string) {
    return url === urlFirst
  },
}
