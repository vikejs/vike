export { BatiWidget }

import React, { useEffect, useState } from 'react'

function BatiWidget() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      // Move this import to +client.js once we make non-global +client.js work
      await import('@batijs/elements' as string)
      setIsLoading(false)
    })()
  }, [])
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', fontSize: '2em', margin: 100, paddingBottom: 50 }}>Loading scaffolder...</div>
    )
  }
  return (
    <>
      <div className="container">
        {/* @ts-expect-error */}
        <bati-widget theme="light"></bati-widget>
      </div>
    </>
  )
}
