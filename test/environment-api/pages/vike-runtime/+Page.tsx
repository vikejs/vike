export default Page

import React, { useEffect, useState } from 'react'
import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'
import { environmentName, viteEnvironmentName, loadPageConfig } from 'vike/runtime'

function Page() {
  const data = useData<{ server: unknown; worker: unknown }>()
  const { pageId } = usePageContext()
  const [client, setClient] = useState<unknown>(null)
  useEffect(() => {
    loadPageConfig(pageId!).then(({ config }) => {
      setClient({ environmentName, viteEnvironmentName, hasPage: typeof config.Page === 'function' })
    })
  }, [])
  return (
    <>
      <h1>vike/runtime</h1>
      <pre id="server">{JSON.stringify(data.server)}</pre>
      <pre id="worker">{JSON.stringify(data.worker)}</pre>
      <pre id="client">{JSON.stringify(client)}</pre>
    </>
  )
}
