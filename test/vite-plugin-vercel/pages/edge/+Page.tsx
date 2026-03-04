import React from 'react'

export default function Page() {
  return (
    <>
      <h1>Edge</h1>
      In production, this page is:
      <ul>
        {/* @ts-expect-error EdgeRuntime is defined by Vercel Edge */}
        <li>Running on Edge Runtime (typeof EdgeRuntime: {typeof EdgeRuntime})</li>
      </ul>
    </>
  )
}
