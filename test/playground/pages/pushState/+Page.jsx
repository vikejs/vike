export default Page

import React, { useState } from 'react'
import { useData } from 'vike-react/useData'
import { getPageContext } from 'vike/getPageContext'

function Page() {
  const data = useData()
  const { timestamp } = data
  const [timestampClient, setTimestampClient] = useState()
  const [isLinkAdded, setIsLinkAdded] = useState(false)
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
      <button onClick={() => setTimestampClient(getPageContext({ asyncHook: true }).data.timestamp)}>
        Read getPageContext()
      </button>
      <p>
        Timestamp of <code>getPageContext()</code>: <span id="timestamp-client">{timestampClient}</span>
      </p>
      <button onClick={() => setIsLinkAdded(true)}>Add link</button>
      {isLinkAdded && (
        <a id="link-added" href="/about">
          Added link
        </a>
      )}
    </>
  )
}
