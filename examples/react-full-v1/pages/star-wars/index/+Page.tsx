export default Page

import React from 'react'
import type { Movie } from '../types'

function Page({ movies }: { movies: Movie[] }) {
  return (
    <>
      <h1>Star Wars Movies</h1>
      <ol>
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
          </li>
        ))}
      </ol>
      <p>
        Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
      </p>
      <p>
        Data can be fetched by using the <code>onBeforeRender()</code> hook.
      </p>
    </>
  )
}
