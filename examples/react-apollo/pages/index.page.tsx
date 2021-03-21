import React from "react";
import { gql, useQuery } from "@apollo/client";

export default IndexPage;

function IndexPage() {
  const {data} = useQuery(gql`
    {
      countries {
        code
        name
      }
    }
  `);

  return (
    <>
      <h1>
        Welcome to <code>vite-plugin-ssr</code>
      </h1>
      <p>This list of countries was fetched server-side using the Apollo client defined in <code>server/index.ts</code>.</p>
      <p>The Apollo client on the server runs the query and stores the result in its cache. This cache is then passed to the client-side Apollo client defined in <code>pages/_default/_default.page.client.tsx</code> via <code>restore()</code></p>
      <p>It's important that the Apollo client on the server is instantiated on each request.</p>
      <ul>
        {data?.countries.map(country => (
          <li key={country.code}>{country.name}</li>
        ))}
      </ul>
    </>
  );
}
