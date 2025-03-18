export { BatiWidget }

import { usePageContext2 } from '@brillout/docpress'
import React, { useEffect, useState } from 'react'

function BatiWidget() {
  const pageContext = usePageContext2()
  const [isLoading, setIsLoading] = useState(import.meta.env.SSR || pageContext.isHydration)
  useEffect(() => {
    setIsLoading(false)
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
