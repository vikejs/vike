import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

export default IndexPage;

function IndexPage({ randomMessage }) {
  const { data } = useQuery(gql`
    {
      countries {
        code
        name
      }
    }
  `);

  return (
    <>
      <p>
        Random message from server: <span>{randomMessage}</span>.
      </p>
      <p>
        <Counter />
      </p>
      <p>
        This list of countries was fetched server-side using the Apollo client
        defined in <code>server/index.js</code>.
      </p>
      <p>
        The Apollo client on the server runs the query and stores the result in
        its cache. This cache is then passed to the client-side Apollo client
        defined in <code>pages/_default/_default.page.client.jsx</code>
        {" via "}
        <code>restore()</code>.
      </p>
      <ul>
        {data?.countries.map((country) => (
          <li key={country.code}>{country.name}</li>
        ))}
      </ul>
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Counter <span>{count}</span>
    </button>
  );
}
