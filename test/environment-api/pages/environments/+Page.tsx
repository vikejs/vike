export default Page

import React from 'react'
import { useData } from 'vike-react/useData'

function Page() {
  const data = useData<{ server: unknown; worker: unknown }>()
  return (
    <>
      <h1>Vike environments</h1>
      <pre id="server">{JSON.stringify(data.server)}</pre>
      <pre id="worker">{JSON.stringify(data.worker)}</pre>
    </>
  )
}
