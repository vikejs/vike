import React from 'react'
import fetch from 'cross-fetch'
import { filterMovieData } from './filterMovieData'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { MovieDetails } from './types'

export { Page }
export { onBeforeRender }

function Page({ movie }: { movie: MovieDetails }) {
  return (
    <>
      <h1>{movie.title}</h1>
      Release Date: {movie.release_date}
      <br />
      Director: {movie.director}
      <br />
      Producer: {movie.producer}
    </>
  )
}

async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const response = await fetch(`https://star-wars.brillout.com/api/films/${pageContext.routeParams.id}.json`)
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    pageContext: {
      pageProps: {
        movie,
      },
      documentProps: {
        // The page's <title>
        title,
      },
    },
  }
}
