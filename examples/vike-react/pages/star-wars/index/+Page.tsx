export { Page }

import React from 'react'
import type { Data } from './+data'
import { useData } from 'vike-react/useData'

function Page() {
  const movies = useData<Data>()
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
    </>
  )
}
