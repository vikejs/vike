// https://vike.dev/data
export { data }

import type { DataAsync } from 'vike/types'

const data: DataAsync = async (pageContext): ReturnType<DataAsync> => {
  return {
    perPageDataWasCalled: true,
    perPageDataWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client'
  }
}
