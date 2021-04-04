import fetch from 'node-fetch'
import { Movie } from './types'

export { addContextProps }
export { setPageProps }
export { prerender }

type ContextProps = {
  movies: Movie[]
  docTitle: string
}

async function addContextProps(): Promise<ContextProps> {
  const response = await fetch('https://swapi.dev/api/films/')
  const movies: Movie[] = ((await response.json()) as any).results.map((movie: any, i: number) => ({
    ...movie,
    id: String(i + 1)
  }))

  // The page's <title>
  const docTitle = getTitle(movies)

  return { movies, docTitle }
}

function setPageProps({ contextProps: { movies, docTitle } }: { contextProps: ContextProps }) {
  // We remove data we don't need: (`vite-plugin-ssr` serializes and passes `pageProps`
  // to the client; we want to minimize what it sent over the network.)
  movies = movies.map(({ id, title, release_date }) => ({
    title,
    release_date,
    id
  }))

  return { movies, docTitle }
}

async function prerender() {
  const { movies } = await addContextProps()

  return [
    {
      url: '/star-wars',
      // We already provide `contextProps` here so that `vite-plugin-ssr`
      // will *not* have to call the `addContextProps()` hook defined
      // above in this file.
      contextProps: { movies, docTitle: getTitle(movies) }
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `contextProps` of other pages.
        // This means that `vite-plugin-ssr` will not have to call the
        // `addContextProps()` hook a single time and the Star Wars API
        // will be called only once (in this `prerender()` hook) for
        // pre-rendering all pages.
        contextProps: {
          movie,
          docTitle: movie.title
        }
      }
    })
  ]
}

function getTitle(movies: Movie[]): string {
  const title = `${movies.length} Star Wars Movies`
  return title
}
