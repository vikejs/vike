// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { useConfig } from 'vike-react/useConfig'
import type { PageContextServer } from 'vike/types'
import type { MovieDetails } from '../types'
import React from 'react'

const data = async (pageContext: PageContextServer) => {
  const config = useConfig()

  const response = await fetch(`https://brillout.github.io/star-wars/api/films/${pageContext.routeParams.id}.json`)
  let movie = (await response.json()) as MovieDetails

  const { title } = movie
  config({
    title, // <title>
    Head: (
      <>
        <meta name="description" content={`Star Wars Movie ${title} from ${movie.director}`} />
      </>
    ),
  })

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  movie = minimize(movie)

  return movie
}

function minimize(movie: MovieDetails): MovieDetails {
  const { id, title, release_date, director, producer } = movie
  movie = { id, title, release_date, director, producer }
  return movie
}
