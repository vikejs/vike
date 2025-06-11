// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { fetchStarWarsMovies, filterMoviesData, getTitle } from './data'

const data = async () => {
  const movies = await fetchStarWarsMovies()
  return {
    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    movies: filterMoviesData(movies),
    // The page's <title>
    title: getTitle(movies),
  }
}
