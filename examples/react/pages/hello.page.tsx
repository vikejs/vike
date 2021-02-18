import React from 'react'

export default Hello

function Hello({ name }: { name: string }) {
  return (
    <>
      <h1>Hello</h1>
      <p>
        Bonjour <b>{name}</b>.
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
        Parameterized routes can be defined by creating a{' '}
        <code>.page.route.*</code> file.
      </p>
      <pre>{`// /pages/hello.page.route.ts

export default '/hello/:name';`}</pre>
    </>
  )
}
