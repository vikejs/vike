import React, { useContext } from 'react'

export { SsrDataProvider }
export { useSsrData }
export { getSsrDataBuffer }

const Ctx = React.createContext<Data>(undefined as any)

type Data = Record<string, Entry>
type Entry =
  | { state: 'pending'; promise: Promise<unknown> }
  | { state: 'error'; error: unknown }
  | { state: 'done'; value: unknown }

function SsrDataProvider({ children }: { children: React.ReactNode }) {
  const data = {}
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

function getSsrDataBuffer(): null | string {
  if (ssrDataBuffer.length === 0) {
    return null
  }
  const injection = `<script class="${className}" type="application/json">${JSON.stringify(ssrDataBuffer)}</script>`
  ssrDataBuffer.length = 0
  return injection
}

const className = 'react-streaming_ssr-data'

type SsrData = { key: string; value: unknown }

function getSsrData(key: string): { isAvailable: true; value: unknown } | { isAvailable: false } {
  const els = Array.from(window.document.querySelectorAll(`.${className}`))
  // console.log('querySelectorAll: ', els, els.length)
  for(const el of els) {
    // TODO: JSON-S
    const data: SsrData[] = JSON.parse(el.textContent)
    for(const entry of data) {
      // console.log('entry: ', entry)
      assert(typeof entry.key === 'string')
      if (entry.key === key) {
        const { value } = entry
        return { isAvailable: true, value }
      }
    }
  }
  return { isAvailable: false }
}
const ssrDataBuffer: SsrData[] = []

function assert(condition: unknown): asserts condition {
  if (!condition) {
    // TODO
    throw new Error('Something went wrong')
  }
}

function useSsrData(key: string, asyncFn: () => Promise<unknown>) {
  // console.log('useSsrData', key)
  if (isClientSide()) {
    const ssrData = getSsrData(key)
    // console.log('ssrData: ', ssrData)
    if (ssrData.isAvailable) {
      return ssrData.value
    }
  }
  const data = useContext(Ctx)
  let entry = data[key]
  if (!entry) {
    const promise = (async () => {
      let value: unknown
      try {
        value = await asyncFn()
      } catch (error) {
        // React seems buggy around error handling; we handle errors ourselves
        entry = data[key] = { state: 'error', error }
      }
      entry = data[key] = { state: 'done', value }
      if (isServerSide()) {
        ssrDataBuffer.push({ key, value })
      }
    })()
    entry = data[key] = { state: 'pending', promise }
  }
  if (entry.state === 'pending') {
    throw entry.promise
  }
  if (entry.state === 'error') {
    throw entry.error
  }
  if (entry.state === 'done') {
    return entry.value
  }
}

function isServerSide() {
  return !isClientSide()
}
function isClientSide() {
  return typeof window !== 'undefined' && typeof window?.getComputedStyle === 'function'
}
