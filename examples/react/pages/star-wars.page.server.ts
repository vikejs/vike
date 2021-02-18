import fetch from 'node-fetch'

export default {
  addInitialProps
}

type Movie = {
  title: string
  release_date: string
}

async function addInitialProps() {
  const response = await fetch('https://swapi.dev/api/films/')
  const data: any = await response.json()
  let starWarsMovies: Movie[] = data.results

  starWarsMovies = patchResult(starWarsMovies)

  // We only retrun the data we need. (`vite-plugin-ssr` passes the data to the client
  // and we want to minimize was it sent over the network.)
  starWarsMovies = starWarsMovies.map(({ title, release_date }) => ({
    title,
    release_date
  }))

  // The page's <title>
  const title = `${starWarsMovies.length} Star Wars Movies`

  return { starWarsMovies, title }
}

// The API is missing the latest star wars movies
function patchResult(starWarsMovies: Movie[]) {
  const sideFranchise = [
    {
      title: 'Rogue One: A Star Wars Story',
      release_date: '2016-12-16'
    },
    {
      title: 'Solo: A Star Wars Story',
      release_date: '2018-05-25'
    }
  ]
  return [
    ...starWarsMovies,
    {
      title: 'The Force Awakens',
      release_date: '2015-12-18'
    },
    {
      title: 'The Last Jedi',
      release_date: '2017-12-15'
    },
    {
      title: 'The Rise of Skywalker',
      release_date: '2019-12-20'
    }
    // Uncomment to see auto-reload in action
    // ...sideFranchise
  ]
}

function extractRelevantData(starWarsMovies: Movie[]) {}
