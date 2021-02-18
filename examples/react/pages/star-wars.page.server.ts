import fetch from 'node-fetch'

export default {
  addInitialProps
}

async function addInitialProps() {
  const response = await fetch('https://swapi.dev/api/films/')
  const data: any = await response.json()
  const starWarsMovies = data.results
  return { starWarsMovies }
}
