export { onHydrationEnd }

import type { OnHydrationEndSync } from 'vike/types'

const onHydrationEnd: OnHydrationEndSync = (): ReturnType<OnHydrationEndSync> => {
  console.log('Hydration finished; page is now interactive.')
}
