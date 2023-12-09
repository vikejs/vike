// https://vike.dev/data
export { data }

import type { DataAsync } from 'vike/types'
import { PerPageData } from '../../renderer/types'

const data: DataAsync<PerPageData> = async (pageContext): ReturnType<DataAsync<PerPageData>> => {
  return {
    perPageDataWasCalled: true,
    perPageDataWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client'
  }
}
