import React from 'react'

export { Page }

function Page({ movies }) {
  return (
    <>
      <h1>Star Wars Movies</h1>
      <ol>
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            {title} ({release_date})
          </li>
        ))}
      </ol>
    </>
  )
}
