export { title }

import type { Data } from './+data'
import type { PageContext } from 'vike/types'

function title(pageContext: PageContext<Data>) {
  const { movies } = pageContext.data
  return `${movies.length} Star Wars Movies`
}
