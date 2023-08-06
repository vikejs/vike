import { SignInButton, useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export { Page }

function Page() {
  const { isLoaded, isSignedIn } = useAuth()
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/protected")
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    fetchData()
  }, [isSignedIn])

  if (!isLoaded || !isSignedIn) {
    return (
      <>
        <h1>Access Denied</h1>
        <div>You must be signed in to view this page.</div> <br />
        <SignInButton />
      </>
    )
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </>
  )
}
