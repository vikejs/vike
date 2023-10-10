// https://vike.dev/onBeforeRender

import type { OnBeforeRender } from 'vike/types'
import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies'

const onBeforeRender: OnBeforeRender = async (pageContext): ReturnType<OnBeforeRender> => {
  await sleep(700) // Simulate slow network
  const movies = await getStarWarsMovies()
  return {
    pageContext: {
      pageProps: {
        // We remove data we don't need because we pass `pageContext.movies` to
        // the client; we want to minimize what is sent over the network.
        movies: filterMoviesData(movies)
      },
      // The page's <title>
      title: getTitle(movies)
    }
  }
}
export default onBeforeRender

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
