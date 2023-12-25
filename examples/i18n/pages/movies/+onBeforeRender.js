export default onBeforeRender

import fetch from 'node-fetch'

async function onBeforeRender() {
  const movies = await getMovies()
  const pageProps = { movies }
  return { pageContext: { pageProps } }
}

async function getMovies() {
  const resp = await fetch('https://star-wars.brillout.com/api/films.json')
  let movies = (await resp.json()).results
  movies = reducePayload(movies)
  return movies
}

function reducePayload(movies) {
  return movies.map((movie) => {
    const { title, release_date } = movie
    return { title, release_date }
  })
}
