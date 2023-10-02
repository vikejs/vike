import type { Config } from "vike/types"

const onHydrationEnd: Config['onHydrationEnd'] = (): void => {
  console.log('Hydration finished; page is now interactive.')
}
export default onHydrationEnd
