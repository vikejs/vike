export { description }

import type { Data } from './+data.js'
import type { PageContext } from 'vike/types'

function description(pageContext: PageContext<Data>) {
  const { movies } = pageContext.data
  return `All the ${movies.length} movies from the Star Wars franchise`
}
