import React from 'react'
import { useSession } from 'next-auth/client'
import { TodoList } from '../components/TodoList'

export { Page }

function Page() {
  const [session, loading] = useSession()

  if (loading) {
    return <p>loading...</p>
  }

  if (!session) {
    return <p>You are not logged in.</p>
  }

  return (
    <>
      <h1>{`Hola ${session.user!.name}`}</h1>
      <TodoList />
    </>
  )
}
