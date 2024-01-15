// https://vike.dev/useData
export { useData }

import { type ComputedRef, computed } from 'vue'
import { usePageContext } from './usePageContext'

/** https://vike.dev/useData */
function useData<Data>(): ComputedRef<Data> {
  const data = computed(() => (usePageContext() as { data: Data }).data)
  return data
}
