import React from 'react'
import { useData } from 'vike-react/useData'
import type { Data } from './+data'

export default function Page() {
  const { edgeType } = useData<Data>()

  return (
    <>
      <h1>Edge</h1>
      In production, this page is:
      <ul>
        <li>Running on Edge Runtime (typeof EdgeRuntime: {edgeType})</li>
      </ul>
    </>
  )
}
