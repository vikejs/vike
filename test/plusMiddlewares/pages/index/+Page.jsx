export default Page

import React from 'react'
import { Counter } from './Counter'

function Page(pageProps) {
  return (
    <>
      <h1>Welcome</h1>
      <ul>
        <li>PUBLIC_ENV__SOME_ENV: {import.meta.env.PUBLIC_ENV__SOME_ENV}</li>
        <li>SOME_OTHER_ENV: {import.meta.env.SOME_OTHER_ENV}</li>
        <li>data: {pageProps.data}</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
