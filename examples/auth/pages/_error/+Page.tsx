export default Page

import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Counter } from '../../components/Counter'

function Page() {
  const pageContext = usePageContext()

  // Message shown to the user
  let msg
  let title

  // Handle `throw render(403, { notAdmin: true })`
  if (pageContext.abortReason?.notAdmin) {
    msg = "You cannot access this page because you aren't an administrator."
    title = 'Unauthorized'
  }

  // Fallback error message
  if (!msg) {
    msg = pageContext.is404 ? "This page doesn't exist." : 'Something went wrong. Sincere apologies. Try again (later).'
    title = pageContext.is404 ? "Doesn't exist" : 'Error'
  }

  return (
    <>
      <h1>{title}</h1>
      <p>{msg}</p>
      <p>
        This page is hydrated: <Counter />
      </p>
    </>
  )
}

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      abortReason?: {
        notAdmin?: true
      }
    }
  }
}
