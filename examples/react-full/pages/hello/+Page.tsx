export default Page

import React from 'react'
import { useData } from '../../renderer/useData'
import type { Data } from './+data'

function Page() {
  const { name } = useData<Data>()
  return (
    <>
      <h1>Hello</h1>
      <p>
        Hi <b>{name}</b>.
      </p>
      <ul>
        <li>
          <a href="/hello/eli">/hello/eli</a>
        </li>
        <li>
          <a href="/hello/jon">/hello/jon</a>
        </li>
      </ul>
      <p>
        Parameterized routes can be defined by exporting a route string in <code>+route.ts</code>.
      </p>
    </>
  )
}
