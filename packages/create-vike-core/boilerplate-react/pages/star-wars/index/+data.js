// https://vike.dev/data
export { data }

const data = async (pageContext) => {
  await sleep(700) // Simulate slow network

  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = await response.json()

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  const movies = minimize(moviesData)

  return {
    movies,
    // Set <title> (it's a convention we implemented in the getPageTitle() function)
    title: `${movies.length} Star Wars Movies`,
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
