export default Page

import React, {useEffect} from 'react'
import { Counter } from './Counter'
import { usePageContext } from 'vike-react/usePageContext'
// @ts-expect-error
import { hello } from '../../hello.telefunc'

function Page() {
  const pageContext = usePageContext()
  useEffect(() => {
    (async () =>{
      const msg = await hello({name: 'Jon' })
      console.log(msg)
    })()
  })
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <p>
        <code>pageContext.globalContext.someEnvVar === {JSON.stringify(pageContext.globalContext.someEnvVar)}</code>
      </p>
    </>
  )
}
