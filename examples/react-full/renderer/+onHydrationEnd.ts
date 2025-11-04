// https://vike.dev/onHydrationEnd
export { onHydrationEnd }

import type { PageContextClient } from 'vike/types'

const onHydrationEnd = async (pageContext: PageContextClient) => {
  console.log('Hydration finished; page is now interactive.')
}
