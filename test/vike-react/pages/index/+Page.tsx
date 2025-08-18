export default Page

import React, { useId } from 'react'
import { Counter } from '../../components/Counter'
import image from '../../assets/logo-new.svg'
import { Config } from 'vike-react/Config'

function Page() {
  // Will be printed on the server and in the browser:
  console.log('Rendering the landing page')

  const id = useId()
  console.log(id)

  return (
    <>
      <Config image={image}></Config>
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
