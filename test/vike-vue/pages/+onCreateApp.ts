// https://vike.dev/onCreateApp
export { onCreateApp }

import type { OnCreateAppSync } from 'vike-vue/types'
import ToastPlugin from 'vue-toast-notification'

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  if (pageContext.isRenderingHead) return
  const { app } = pageContext
  app.use(ToastPlugin)
  console.log(`Vue version: ${app.version}`)
}
