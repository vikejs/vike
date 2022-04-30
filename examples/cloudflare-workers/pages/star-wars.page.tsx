export { Page }

import React, { Suspense } from 'react'
import { useAsync } from 'react-streaming'
import { usePageContext } from '../renderer/usePageContext'
import { Counter } from '../components/Counter'

function Page() {
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
  const movies = useAsync(async () => {
    const fetch = pageContext.fetch ?? globalThis.fetch
    const response = await fetch('https://star-wars.brillout.com/api/films.json')
    // Simulate slow network
    await new Promise((r) => setTimeout(r, 1 * 2000))
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

type Movie = {
  id: string
  title: string
  release_date: string
}
async function getMovies(response: any): Promise<Movie[]> {
  const moviesFromApi = (await response.json()).results as MovieFromApi[]
  const movies = cleanApiResult(moviesFromApi)
  return movies
}

type MovieFromApi = {
  title: string
  release_date: string
  director: string
  producer: string
}
function cleanApiResult(moviesFromApi: MovieFromApi[]): Movie[] {
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
