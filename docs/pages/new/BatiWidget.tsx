export { BatiWidget }

import React, { useEffect, useState } from 'react'

function BatiWidget() {
  const [isLoading, setIsLoading] = useState(true)
  const isDark = useIsDark()
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
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        {/* @ts-expect-error */}
        <bati-widget theme={isDark ? 'dark' : 'light'}></bati-widget>
      </div>
    </>
  )
}

// DocPress `darkMode` sets the `dark` class on <html>
function useIsDark() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsDark(root.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
}
