// https://vike.dev/data
export { data }

import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies'

async function data() {
  await sleep(700) // Simulate slow network
  const movies = await getStarWarsMovies()
  return {
    // We remove data we don't need because we pass `pageContext.movies` to
    // the client; we want to minimize what is sent over the network.
    movies: filterMoviesData(movies),
    // The page's <title>
    title: getTitle(movies)
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
