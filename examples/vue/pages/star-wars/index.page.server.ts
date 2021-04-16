import fetch from 'node-fetch'
import { filterMovieData } from './movie.page.server'
import { Movie, MovieDetails } from './types'

export { addContextProps }
export { prerender }

type ContextProps = {
  pageProps: {
    movies: Movie[]
  }
  docTitle: string
}

async function addContextProps(): Promise<ContextProps> {
  const movies = await getStarWarsMovies()
  return {
    pageProps: {
      // We remove data we don't need because we pass `contextProps.movies` to
      // the client; we want to minimize what is sent over the network.
      movies: filterMoviesData(movies)
    },
    // The page's <title>
    docTitle: getTitle(movies)
  }
}

async function getStarWarsMovies(): Promise<MovieDetails[]> {
  const response = await fetch('https://swapi.dev/api/films/')
  let movies: MovieDetails[] = ((await response.json()) as any).results
  movies = movies.map((movie: MovieDetails, i: number) => ({
    ...movie,
    id: String(i + 1)
  }))
  return movies
}

function filterMoviesData(movies: MovieDetails[]): Movie[] {
  return movies.map((movie: MovieDetails) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}

async function prerender() {
  const movies = await getStarWarsMovies()

  return [
    {
      url: '/star-wars',
      // We already provide `contextProps` here so that `vite-plugin-ssr`
      // will *not* have to call the `addContextProps()` hook defined
      // above in this file.
      contextProps: {
        pageProps: {
          movies: filterMoviesData(movies)
        },
        docTitle: getTitle(movies)
      }
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `contextProps` of other pages.
        // This means that `vite-plugin-ssr` will not call any
        // `addContextProps()` hook and the Star Wars API will be called
        // only once (in this `prerender()` hook).
        contextProps: {
          pageProps: {
            movie: filterMovieData(movie)
          },
          docTitle: movie.title
        }
      }
    })
  ]
}

function getTitle(movies: Movie[] | MovieDetails[]): string {
  const title = `${movies.length} Star Wars Movies`
  return title
}
