export default Page

import React from 'react'
import { LocaleText } from '../../renderer/LocaleText'

function Page(pageProps) {
  return (
    <>
      <h1>
        Star Wars <LocaleText>Movies</LocaleText>
      </h1>
      <MovieList movies={pageProps.movies} />
    </>
  )
}

function MovieList({ movies }) {
  return (
    <ol>
      {movies.map(({ title, release_date }, i) => (
        <li key={i}>
          {title} ({release_date})
        </li>
      ))}
    </ol>
  )
}
