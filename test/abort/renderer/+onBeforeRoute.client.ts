export default onBeforeRoute

import { abort } from 'vike/abort'
import { hasUnsavedChanges } from './unsavedChanges'

function onBeforeRoute() {
  if (hasUnsavedChanges() && !window.confirm('Leave this page? Your changes will be lost.')) {
    throw abort()
  }
}
