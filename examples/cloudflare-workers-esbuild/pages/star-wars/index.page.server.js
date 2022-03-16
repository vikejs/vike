export { onBeforeRender }

async function onBeforeRender(pageContext) {
  const movies = await getStarWarsMovies(pageContext)
  return {
    pageContext: {
      pageProps: {
        movies: filterMoviesData(movies),
      },
    },
  }
}

async function getStarWarsMovies(pageContext) {
  const response = await pageContext.fetch('https://star-wars.brillout.com/api/films.json')
  let movies = (await response.json()).results
  movies = movies.map((movie, i) => ({
    ...movie,
    id: String(i + 1),
  }))
  return movies
}

function filterMoviesData(movies) {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
