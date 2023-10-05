// https://vike.dev/onBeforeRender

import type { OnBeforeRender, OnBeforeRenderParam, OnBeforeRenderReturn } from 'vike/types'
import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies'

// NOTE(aurelien): that's the alternative style, still with full safety. I'm wondering if we should
// keep `Config['onBeforeRender']` instead of `OnBeforeRender` in order for the user to easily modify
// `Config` through `Vike.Config` without unexpected results?
const onBeforeRender: OnBeforeRender = async (pageContext: OnBeforeRenderParam): OnBeforeRenderReturn => {
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
