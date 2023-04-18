import React from 'react'
import { gql, useQuery } from 'urql'
import { Counter } from './Counter'

const query = gql`
  {
    countries {
      code
      name
    }
  }
`

const Page = () => {
  const [result] = useQuery({ query })

  const { data, fetching, error } = result

  return (
    <>
      <h1>Counter</h1>
      <Counter />
      <h1>Countries</h1>
      <>
        {fetching && <p>Loading...</p>}
        {error && <p>Oh no... {error.message}</p>}
        {data && (
          <ul>
            {data.countries.map((country: { name: string; code: string }) => (
              <li key={country.code}>{country.name}</li>
            ))}
          </ul>
        )}
      </>
    </>
  )
}

export { Page }
