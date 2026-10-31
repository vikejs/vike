export { BatiWidget }

import React, { useEffect, useState } from 'react'
import './BatiWidget.css'

function BatiWidget() {
  // No placeholder if a previous visit already loaded the scaffolder
  const [isLoading, setIsLoading] = useState(
    () => typeof customElements === 'undefined' || !customElements.get('bati-widget'),
  )
  const isDark = useIsDark()
  useEffect(() => {
    ;(async () => {
      // Move this import to +client.js once we make non-global +client.js work
      await import('@batijs/elements' as string)
      setIsLoading(false)
    })()
  }, [])
  return (
    <div className="container bati-widget-container" style={{ display: 'flex', justifyContent: 'center' }}>
      {isLoading ? (
        <div style={{ textAlign: 'center', fontSize: '2em', marginTop: 100 }}>Loading scaffolder...</div>
      ) : (
        // @ts-expect-error
        <bati-widget theme={isDark ? 'dark' : 'light'}></bati-widget>
      )}
    </div>
  )
}

// DocPress `darkMode` sets the `dark` class on <html>
function useIsDark() {
  // Read on the first render: the widget renders on the first frame when the scaffolder is already loaded
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
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
