import React from 'react'

export default StarWars

function StarWars({
  starWarsMovies
}: {
  starWarsMovies: { title: string; release_date: string }[]
}) {
  return (
    <>
      <h1>Star Wars movies</h1>
      <ol>
        {starWarsMovies.map(({ title, release_date }) => (
          <li key={title}>
            {title}, {release_date}.
          </li>
        ))}
      </ol>
      <p>
        Source: <a href="https://swapi.dev/api/films/">swapi.dev/api/films/</a>.
      </p>
      <p>
        Data can be fetched by defining <code>addInitialProps</code> in{' '}
        <code>.page.server.js</code>.
      </p>
      <pre>{`// /pages/star-wars.page.server.ts

import fetch from 'node-fetch'

export default {
  addInitialProps
}

async function addInitialProps(initialProps) {
  const response = await fetch('https://swapi.dev/api/films/')
  const data: any = await response.json()
  const starWarsMovies = data.results
  return { starWarsMovies }
}`}</pre>
    </>
  )
}
