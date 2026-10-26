export default Page

import React, { useEffect, useState } from 'react'
import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'
import type { Data } from './+data'

const consumed = new WeakSet<object>()

function Page() {
  const data = useData<Data>()
  const pageContext = usePageContext()
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    // A value can be read only once (React's Strict Mode runs effects twice)
    if (consumed.has(data)) return
    consumed.add(data)
    const set = (key: string, value: string) => setValues((values) => ({ ...values, [key]: value }))
    const setError = (key: string, err: Error) => {
      // The values still pending reject with pageContext.abortSignal.reason when the user navigates away
      set(key, err === pageContext.abortSignal.reason ? 'aborted' : err.message)
    }
    data.promise.then(
      (value) => set('promise', value),
      (err: Error) => setError('promise', err),
    )
    data.failing.catch((err: Error) => setError('failing', err))
    ;(async () => {
      const chunks: string[] = []
      try {
        for await (const chunk of data.generator) {
          chunks.push(chunk)
          set('generator', chunks.join(','))
        }
      } catch (err) {
        setError('generator', err as Error)
      }
    })()
    ;(async () => {
      const reader = data.bytes.getReader()
      const { value } = await reader.read()
      set('bytes', Array.from(value!, (b) => b.toString(16).padStart(2, '0')).join(''))
    })()
  }, [data])
  return (
    <>
      <h1>Streamed values</h1>
      <ul>
        {['promise', 'generator', 'bytes', 'failing'].map((key) => (
          <li key={key} id={key}>
            {values[key]}
          </li>
        ))}
      </ul>
    </>
  )
}
