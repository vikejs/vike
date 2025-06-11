export default Page

import React, { Suspense } from 'react'
import { useAsync } from 'react-streaming'
import fetch from 'cross-fetch'
import { usePageContext } from '../../../renderer/usePageContext'
import { Counter } from '../../../components/Counter'

function Page({ movies }) {
  return (
    <>
      <h1>Star Wars Movies</h1>
      Interactive while loading: <Counter />
      <Suspense fallback={<p>Loading...</p>}>
        <MovieList />
      </Suspense>
    </>
  )
}

function MovieList() {
  const pageContext = usePageContext()
  const movies = useAsync(['star-wars-movies'], async () => {
    const response = await fetch('https://star-wars.brillout.com/api/films.json')
    // Simulate slow network
    await new Promise((r) => setTimeout(r, 2 * 1000))
    const movies = await getMovies(response)
    return movies
  })
  return (
    <ol>
      {movies.map(({ id, title, release_date }) => (
        <li key={id}>
          {title} ({release_date})
        </li>
      ))}
    </ol>
  )
}

async function getMovies(response) {
  const moviesFromApi = (await response.json()).results
  const movies = cleanApiResult(moviesFromApi)
  return movies
}

function cleanApiResult(moviesFromApi) {
  const movies = moviesFromApi.map((movie, i) => {
    const { title, release_date } = movie
    return {
      id: String(i + 1),
      title,
      release_date,
    }
  })
  return movies
}
