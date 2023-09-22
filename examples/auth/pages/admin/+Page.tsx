export default Page

import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Counter } from '../../components/Counter'

function Page() {
  const pageContext = usePageContext()
  const { userFullName } = pageContext
  return (
    <>
      <h1>Admin Panel</h1>
      <p>
        You're able to access this page because you're logged in as <b>{userFullName}</b>.
      </p>
      <p>
        This page is hydrated: <Counter />
      </p>
    </>
  )
}
