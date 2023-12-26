// Hook `useData()` to make `pageContext.data` available from any Vue component.
// See
// * https://vike.dev/data
// * https://vike.dev/pageContext-anywhere

export { useData }

import { usePageContext } from './usePageContext'

function useData<Data>(): Data {
  const { data } = usePageContext() as any
  return data
}
