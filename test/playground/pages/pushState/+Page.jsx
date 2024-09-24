export default Page

import React from 'react'
import { useData } from 'vike-react/useData'

function Page() {
  const data = useData()
  const { timestamp } = data
  return (
    <>
      <h1>pushState</h1>
      <p>
        Example of using{' '}
        <code style={{ backgroundColor: '#eee', padding: '3px 4px', borderRadius: 5 }}>history.pushState()</code>.
      </p>
      <button
        onClick={(ev) => {
          ev.preventDefault()
          history.pushState(null, '', '/pushState?query')
        }}
      >
        Change URL
      </button>
      <p>
        Timestamp fetched from server: <span id="timestamp">{timestamp}</span>
      </p>
    </>
  )
}
