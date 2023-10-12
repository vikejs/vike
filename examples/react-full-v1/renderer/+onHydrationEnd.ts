export { onHydrationEnd }

import type { OnHydrationEnd } from 'vike/types'

const onHydrationEnd: OnHydrationEnd = async (): ReturnType<OnHydrationEnd> => {
  console.log('Hydration finished; page is now interactive.')
}
