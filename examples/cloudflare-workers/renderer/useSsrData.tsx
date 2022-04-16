import React, { useContext } from 'react'

export { SsrDataProvider }
export { useSsrData }
export { ssrDataBuffer }

const Ctx = React.createContext<Record<string, unknown>>(undefined as any)

function SsrDataProvider({ children }: { children: React.ReactNode }) {
  const data = {}
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

const ssrDataBuffer: {key: string, value: unknown}[] = []

function useSsrData<T = unknown>() {
  const data = useContext(Ctx)
  return {
    /*
    has(key: string): boolean {
      return key in data
    },
    */
    get(key: string): T {
      return data[key] as T
    },
    set(key: string, value: T) {
      // console.log(key, key in data)
      if (key in data) {
        // TODO throwing in here doens't work
        throw new Error('Cannot mutate SSR data')
      }
      data[key] = value
      ssrDataBuffer.push({key, value})
    },
    isClientSide: isClientSide(),
  }
}

function isClientSide() {
  return typeof window !== 'undefined' && typeof window?.getComputedStyle === 'function'
}
