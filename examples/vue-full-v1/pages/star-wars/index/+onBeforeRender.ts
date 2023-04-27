// https://vite-plugin-ssr.com/onBeforeRender
export default onBeforeRender

import { fetchStarWarsMovies, filterMoviesData, getTitle } from './data'

async function onBeforeRender() {
  const movies = await fetchStarWarsMovies()
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
