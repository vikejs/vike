// https://vike.dev/onBeforePrerenderStart
export default onBeforePrerenderStart

import { filterMovieData } from '../filterMovieData'
import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies'

async function onBeforePrerenderStart() {
  const movies = await getStarWarsMovies()

  return [
    {
      url: '/star-wars',
      // We already provide `pageContext` here so that `vike`
      // will *not* have to call the `onBeforeRender()` hook defined
      // above in this file.
      pageContext: {
        pageProps: {
          movies: filterMoviesData(movies)
        },
        title: getTitle(movies)
      }
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `pageContext` of other pages.
        // This means that `vike` will not call any
        // `onBeforeRender()` hook and the Star Wars API will be called
        // only once (in this `prerender()` hook).
        pageContext: {
          pageProps: {
            movie: filterMovieData(movie)
          },
          title: movie.title
        }
      }
    })
  ]
}
