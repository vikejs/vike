export default Page

import React, { useState, useEffect } from 'react'

function Page() {
  const [guardExecuted, setGuardExecuted] = useState(false)
  const [timestamp, setTimestamp] = useState<number | null>(null)

  useEffect(() => {
    // Check if guard was executed
    const executed = (window as any).__GUARD_CLIENT_EXECUTED__
    const ts = (window as any).__GUARD_CLIENT_TIMESTAMP__

    setGuardExecuted(!!executed)
    setTimestamp(ts || null)
  }, [])

  return (
    <div>
      <h1>Client-Side Guard Test</h1>
      <p id="guard-status">
        Guard executed: <span id="guard-executed">{guardExecuted ? 'Yes' : 'No'}</span>
      </p>
      {timestamp && (
        <p id="guard-timestamp">
          Timestamp: <span id="guard-ts">{timestamp}</span>
        </p>
      )}
      <div>
        <a href="/">Go to Home</a> | <a href="/about-page">Go to About</a>
      </div>
      <p>
        <small>This page tests that +guard.client.js executes on both page reload and client-side navigation.</small>
      </p>
    </div>
  )
}
