import React from 'react'
import { useSession } from 'next-auth/client'

export { Page }

function Page() {
  const [session, loading] = useSession()

  if (loading) {
    return <p>loading...</p>
  }

  if (!session) {
    return (
      <>
        <h1>Who are you?</h1>
        <a href="/api/auth/signin">
          <button>sign in</button>
        </a>
      </>
    )
  }

  return (
    <>
      <h1>{`Hola ${session.user?.name}`}</h1>
      <a href="/api/auth/signout">
        <button>sign out</button>
      </a>
    </>
  )
}
