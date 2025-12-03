// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies'
import { assert } from '../../../utils/assert'
import { getPageContext } from 'vike/getPageContext'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  await sleep(700) // Simulate slow network
  const movies = await getStarWarsMovies()

  // TEST: getPageContext()
  if (!pageContext.isPrerendering) {
    const pageContext2 = getPageContext({ asyncHook: true })!
    assert(pageContext2.pageId === pageContext.pageId)
    assert(pageContext2.dangerouslyUseInternals._originalObject === pageContext.dangerouslyUseInternals._originalObject)
  }

  return {
    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    movies: filterMoviesData(movies),
    // The page's <title>
    title: getTitle(movies),
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
