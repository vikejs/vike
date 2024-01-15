// https://vike.dev/data
export { data }

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import fetch from 'node-fetch'

// eslint-disable-next-line no-unused-vars
const data = async (pageContext) => {
  await sleep(700) // Simulate slow network

  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = await response.json()

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  const movies = minimize(moviesData)

  return {
    movies,
    // The page's <title>
    title: `${movies.length} Star Wars Movies`
  }
}

function minimize(movies) {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}

function sleep(milliseconds) {
  return new Promise((r) => setTimeout(r, milliseconds))
}
