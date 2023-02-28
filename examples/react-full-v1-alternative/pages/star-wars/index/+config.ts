export default {
  // define functions either directly in the config
  onBeforePrerenderStart,
  // or use dynamic imports
  onBeforeRender: () => import('./onBeforeRender').then((m) => m.default)
}

async function onBeforePrerenderStart() {
  const { filterMovieData } = await import('../filterMovieData')
  const { filterMoviesData, getStarWarsMovies, getTitle } = await import('./getStarWarsMovies')
  const movies = await getStarWarsMovies()

  return [
    {
      url: '/star-wars',
      // We already provide `pageContext` here so that `vite-plugin-ssr`
      // will *not* have to call the `onBeforeRender()` hook defined
      // above in this file.
      pageContext: {
        pageProps: {
          movies: filterMoviesData(movies)
        },
        documentProps: { title: getTitle(movies) }
      }
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `pageContext` of other pages.
        // This means that `vite-plugin-ssr` will not call any
        // `onBeforeRender()` hook and the Star Wars API will be called
        // only once (in this `prerender()` hook).
        pageContext: {
          pageProps: {
            movie: filterMovieData(movie)
          },
          documentProps: { title: movie.title }
        }
      }
    })
  ]
}
