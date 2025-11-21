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
      <h1>Guard Client Success Page</h1>
      <p id="guard-status">
        Guard executed: <span id="guard-executed">{guardExecuted ? 'Yes' : 'No'}</span>
      </p>
      {timestamp && (
        <p id="guard-timestamp">
          Timestamp: <span id="guard-ts">{timestamp}</span>
        </p>
      )}
      <div>
        <a href="/">Go to Home</a> | <a href="/guard-client-only">Try Guard Again</a>
      </div>
      <p>
        <small>
          This page is reached when the client-side guard executes and throws render().
          The guard should work on both page reload and client-side navigation.
        </small>
      </p>
    </div>
  )
}
