// https://vike.dev/useData
export { useData }
export { setData }

import { inject } from 'vue'

const key = Symbol()

/** https://vike.dev/useData */
function useData() {
  const data = inject(key)
  if (!data) throw new Error('setData() not called')
  return data
}

function setData(app, data) {
  app.provide(key, data)
}
