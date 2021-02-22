import fetch from 'node-fetch'

export { addContextProps }
export { setPageProps }

type Movie = {
  title: string
  release_date: string
}
type ContextProps = {
  starWarsMovies: Movie[]
  title: string
}

async function addContextProps(): Promise<ContextProps> {
  const response = await fetch('https://swapi.dev/api/films/')
  const data: any = await response.json()
  let starWarsMovies: Movie[] = data.results

  starWarsMovies = patchResult(starWarsMovies)

  // The page's <title>
  const title = `${starWarsMovies.length} Star Wars Movies`

  return { starWarsMovies, title }
}

function setPageProps({
  contextProps: { starWarsMovies }
}: {
  contextProps: ContextProps
}) {
  // We remove data we don't need: (`vite-plugin-ssr` serializes and passes `pageProps`
  // to the client; we want to minimize what it sent over the network.)
  starWarsMovies = starWarsMovies.map(({ title, release_date }) => ({
    title,
    release_date
  }))

  return { starWarsMovies }
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
