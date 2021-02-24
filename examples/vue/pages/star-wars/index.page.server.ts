import fetch from 'node-fetch'
import { Movie } from './types'

export { addContextProps }
export { setPageProps }

type ContextProps = {
  movies: Movie[]
  title: string
}

async function addContextProps(): Promise<ContextProps> {
  const response = await fetch('https://swapi.dev/api/films/')
  const movies: Movie[] = ((await response.json()) as any).results.map(
    (movie: any, i: number) => ({ ...movie, id: String(i + 1) })
  )

  // The page's <title>
  const title = `${movies.length} Star Wars Movies`

  return { movies, title }
}

function setPageProps({
  contextProps: { movies }
}: {
  contextProps: ContextProps
}) {
  // We remove data we don't need: (`vite-plugin-ssr` serializes and passes `pageProps`
  // to the client; we want to minimize what it sent over the network.)
  movies = movies.map(({ id, title, release_date }) => ({
    title,
    release_date,
    id
  }))

  return { movies }
}
