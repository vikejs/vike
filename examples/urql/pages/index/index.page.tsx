import React from 'react'
import { gql, useQuery } from 'urql'
import { Counter } from './Counter'

const POKEMONS_QUERY = gql`
  query Pokemons {
    pokemons(limit: 10) {
      id
      name
    }
  }
`

const Page = () => {
  const [result] = useQuery({ query: POKEMONS_QUERY })

  const { data, fetching, error } = result

  return (
    <>
      <h1>Pokemons</h1>
      <>
        {fetching && <p>Loading...</p>}
        {error && <p>Oh no... {error.message}</p>}
        {data && (
          <ul>
            {data.pokemons.map((pokemon: { name: string; id: string }) => (
              <li key={pokemon.id}>{pokemon.name}</li>
            ))}
          </ul>
        )}
      </>
      <h1>Counter</h1>
      <Counter />
    </>
  )
}

export { Page }
