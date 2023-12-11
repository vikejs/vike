// https://vike.dev/data
export { data }
export type { Data }

import fetch from 'node-fetch'
import { filterMovieData } from '../filterMovieData'
import type { PageContextServer } from 'vike/types'
import type { MovieDetails } from '../types'
import { render } from 'vike/abort'
import React from 'react'

type Data = Awaited<ReturnType<typeof data>>

const data = async (pageContext: PageContextServer) => {
  const dataUrl = `https://star-wars.brillout.com/api/films/${pageContext.routeParams?.id}.json`
  let movie: MovieDetails
  try {
    const response = await fetch(dataUrl)
    movie = (await response.json()) as MovieDetails
  } catch (err) {
    console.error(err)
    throw render(503, `Couldn't fetch data, because failed HTTP GET request to ${dataUrl}`)
  }

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    movie,
    // The page's <title>
    title
  }
}
