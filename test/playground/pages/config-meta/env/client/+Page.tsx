import React, { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { serializeSettings } from '../serializeSettings'
import { isBrowser } from '../../../isBrowser'

export function Page() {
  const pageContext = usePageContext()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted || !isBrowser) {
    return <></>
  }
  const json = serializeSettings(pageContext)
  return <p id="serialized-settings">{json}</p>
}
