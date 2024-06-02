// https://vike.dev/useData
export { useData }
export { setData }

import { inject } from 'vue'
import type { App } from 'vue'

const key = Symbol()

/** https://vike.dev/useData */
function useData<Data>(): Data {
  const data = inject(key)
  if (!data) throw new Error('setData() not called')
  return data as any
}

function setData(app: App, data: unknown): void {
  app.provide(key, data)
}
