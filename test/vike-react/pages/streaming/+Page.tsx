export default Page

import React, { Suspense } from 'react'
import { useAsync } from 'react-streaming'
import { Counter } from '../../components/Counter'

function Page() {
  return (
    <>
      <h1>Star Wars Movies</h1>
      <p>
        Same as <code>/star-wars</code> page, but showcasing <a href="https://vike.dev/streaming">HTML Streaming</a> and{' '}
        <a href="https://vike.dev/streaming#progressive-rendering">Progressive Rendering</a>. (Note how the interactive
        counter works before the data finished loading.)
      </p>
      <Counter />
      <Suspense fallback={<p>Loading...</p>}>
        <MovieList />
      </Suspense>
    </>
  )
}

function MovieList() {
  const movies = useAsync(['star-wars-movies'], async () => {
    const response = await fetch('https://star-wars.brillout.com/api/films.json')
    // Simulate slow network
    await new Promise((r) => setTimeout(r, 3 * 1000))
    const movies: Movie[] = (await response.json()).results
    return movies
  })

  return (
    <ol>
      {movies.map((movies, index) => (
        <li key={index}>
          {movies.title} ({movies.release_date})
        </li>
      ))}
    </ol>
  )
}

export type Movie = {
  title: string
  release_date: string
}
