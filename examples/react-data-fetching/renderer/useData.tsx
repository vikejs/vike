// https://vike.dev/useData

import { usePageContext } from './usePageContext'

export { useData }

function useData() {
  return usePageContext().data
}
