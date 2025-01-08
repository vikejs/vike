// https://vike.dev/useData
export { useData }
export { setData }

import { inject } from 'vue'
import type { App, InjectionKey, Ref } from 'vue'

const key: InjectionKey<Ref<unknown>> = Symbol()

/** https://vike.dev/useData */
function useData<Data>(): Ref<Data> {
  const data = inject(key)
  if (!data) throw new Error('setData() not called')
  return data as Ref<Data>
}

function setData(app: App, data: Ref<unknown>): void {
  app.provide(key, data)
}
