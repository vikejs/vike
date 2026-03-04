import React from 'react'

export default function Page() {
  return (
    <>
      <h1>ISR</h1>
      In production, this page is:
      <ul>
        <li>Cached for 15 seconds. Last access date: {new Date().toUTCString()}</li>
      </ul>
    </>
  )
}
