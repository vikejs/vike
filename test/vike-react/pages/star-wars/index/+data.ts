// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import fetch from 'node-fetch'
import { useConfig } from 'vike-react/useConfig'
import type { Movie, MovieDetails } from '../types'
import image from '../../../assets/logo-new.svg'

const data = async () => {
  const config = useConfig()

  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json()) as MovieDetails[]

  const n = moviesData.length
  config({
    title: `${n} Star Wars Movies`, // <title>
    description: `All the ${n} movies from the Star Wars franchise`, // <meta name="description">
    image // <meta property="og:image">
  })

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  const movies = minimize(moviesData)

  return movies
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
