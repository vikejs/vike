// https://vike.dev/useData
export { useData }

import { computed } from 'vue'
import { usePageContext } from './usePageContext'

/** https://vike.dev/useData */
function useData() {
  const data = computed(() => usePageContext().data)
  return data
}
