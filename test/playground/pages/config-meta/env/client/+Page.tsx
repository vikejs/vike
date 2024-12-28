import React, { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { serializePageContext } from '../serializePageContext'
import { isBrowser } from '../../../../utils/isBrowser'

export function Page() {
  const pageContext = usePageContext()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted || !isBrowser) {
    return <></>
  }
  const json = serializePageContext(pageContext)
  return <p id="serialized-settings">{json}</p>
}
