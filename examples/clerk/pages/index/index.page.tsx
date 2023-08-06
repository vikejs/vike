import { SignIn, SignOutButton, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'

export { Page }

function Page() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div>Please wait...</div>;
  }

  return (
    <>
      <h1>Clerk + Vite Plugin SSR</h1>
      <SignedIn>
        <div>Hello, {user?.firstName} welcome to Clerk.</div> <br />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  )
}
