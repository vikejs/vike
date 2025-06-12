// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { PageContextClient, PageContextServer } from 'vike/types'
import type { MovieDetails } from '../types'
import { render } from 'vike/abort'

async function data(pageContext: PageContextServer | PageContextClient) {
  const dataUrl = `https://star-wars.brillout.com/api/films/${pageContext.routeParams!.id}.json`
  let movie: MovieDetails
  try {
    const response = await fetch(dataUrl)
    movie = (await response.json()) as MovieDetails
  } catch (err) {
    console.error(err)
    throw render(503, `Couldn't fetch data, because failed HTTP GET request to ${dataUrl}`)
  }

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    movie,
    // The page's <title>
    title,
  }
}
