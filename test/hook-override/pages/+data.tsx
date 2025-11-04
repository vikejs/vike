// https://vike.dev/data
export { data }

import type { PageContextServer } from 'vike/types'
import type { GlobalData } from '../renderer/types'

const data = async (pageContext: PageContextServer): Promise<GlobalData> => {
  return {
    globalDataWasCalled: true,
    globalDataWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
  }
}
