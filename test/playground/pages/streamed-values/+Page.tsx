export default Page

import React, { useEffect, useState } from 'react'
import { useData } from 'vike-react/useData'
import type { Data } from './+data'

const consumed = new WeakSet<object>()

function Page() {
  const data = useData<Data>()
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    // A value can be read only once (React's Strict Mode runs effects twice)
    if (consumed.has(data)) return
    consumed.add(data)
    const set = (key: string, value: string) => setValues((values) => ({ ...values, [key]: value }))
    data.promise.then((value) => set('promise', value))
    data.failing.catch((err: Error) => set('failing', err.message))
    ;(async () => {
      const chunks: string[] = []
      try {
        for await (const chunk of data.generator) {
          chunks.push(chunk)
          set('generator', chunks.join(','))
        }
      } catch (err) {
        set('generator', (err as Error).message)
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
