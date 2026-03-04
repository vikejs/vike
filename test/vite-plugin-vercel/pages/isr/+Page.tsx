import React from 'react'
import { useData } from 'vike-react/useData'
import type { Data } from './+data'

export default function Page() {
  const { date } = useData<Data>()

  return (
    <>
      <h1>ISR</h1>
      In production, this page is:
      <ul>
        <li>Cached for 15 seconds. Last access date: {date}</li>
      </ul>
    </>
  )
}
