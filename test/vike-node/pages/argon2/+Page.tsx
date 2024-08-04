export default Page
import React, { useState } from 'react'
import { onValidatePassword } from './Page.telefunc'

function Page() {
  const [password, setPassword] = useState('')
  const [isValid, setIsValid] = useState<boolean>()

  return (
    <>
      <h1>Example of validating a password using argon2</h1>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault()
          const { isValid } = await onValidatePassword({ password })
          setIsValid(isValid)
        }}
      >
        <input type="text" onChange={(ev) => setPassword(ev.target.value)} value={password} autoFocus={true} />{' '}
        <button type="submit">Sign in</button>
      </form>
      {isValid !== undefined && <div>{isValid ? 'Valid password' : 'Invalid password'}</div>}
    </>
  )
}
