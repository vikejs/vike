// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import fetch from 'node-fetch'
import { useConfig } from 'vike-solid/useConfig'
import type { PageContextServer } from 'vike/types'
import type { MovieDetails } from '../types.js'

const data = async (pageContext: PageContextServer) => {
  const config = useConfig()

  const response = await fetch(`https://brillout.github.io/star-wars/api/films/${pageContext.routeParams?.id}.json`)
  let movie = (await response.json()) as MovieDetails

  config({
    title: movie.title,
    description: `Star Wars Movie ${movie.title} from ${movie.director}`
  })

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = minimize(movie)

  return movie
}

function minimize(movie: MovieDetails): MovieDetails {
  const { id, title, release_date, director, producer } = movie
  movie = { id, title, release_date, director, producer }
  return movie
}
