export { BatiWidget }

import React, { useEffect, useState } from 'react'
import { assert } from '@brillout/docpress'

const scriptSrc = 'https://unpkg.com/@batijs/elements/dist/elements/full.js'

function BatiWidget() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (wasAdded()) {
      setIsLoading(false)
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = scriptSrc
    script.onload = () => {
      setIsLoading(false)
    }
    document.head.appendChild(script)
    assert(wasAdded())
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

function wasAdded() {
  const el = document.querySelector(`script[src="${scriptSrc}"]`)
  return !!el
}
