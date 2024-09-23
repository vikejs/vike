export { title }

import type { Data } from './+data'
import type { PageContext } from 'vike/types'

function title(pageContext: PageContext<Data>) {
  const movie = pageContext.data
  return movie.title
}
