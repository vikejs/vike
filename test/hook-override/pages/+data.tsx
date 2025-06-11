// https://vike.dev/data
export { data }

import type { DataAsync } from 'vike/types'
import { GlobalData } from '../renderer/types'

const data: DataAsync = async (pageContext): Promise<GlobalData> => {
  return {
    globalDataWasCalled: true,
    globalDataWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
  }
}
