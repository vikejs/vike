// https://vite-plugin-ssr.com/onBeforeRender
export default onBeforeRender

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
import type { MovieDetails } from '../types'
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const dataUrl = `https://star-wars.brillout.com/api/films/${pageContext.routeParams.id}.json`
  let response: Response
  try {
    response = await fetch(dataUrl)
  } catch (err) {
    throw RenderErrorPage({ pageContext: { pageProps: { errorDescription: `Couldn't fetch data ${dataUrl}` } } })
  }
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    pageContext: {
      pageProps: {
        movie
      },
      // The page's <title>
      title
    }
  }
}
