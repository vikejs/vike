// https://vike.dev/data
export { data }

import type { PageContextServer } from 'vike/types'
import type { PerPageData } from '../../renderer/types'

const data = async (pageContext: PageContextServer): Promise<PerPageData> => {
  return {
    perPageDataWasCalled: true,
    perPageDataWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
  }
}
