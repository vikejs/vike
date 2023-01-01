
export { Page }

function Page({ name }: { name: string }) {
  return (
    <>
      <h1>Hello</h1>
      <p>
        Hi <b>{name}</b>.
      </p>
      <ul>
        <li>
          <a href="/hello-tsx/eli">/hello-tsx/eli</a>
        </li>
        <li>
          <a href="/hello-tsx/jon">/hello-tsx/jon</a>
        </li>
      </ul>
      <p>
        Parameterized routes can be defined by exporting a route string in <code>*.page.route.js</code>.
      </p>
    </>
  )
}
