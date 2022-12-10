export { prerender }

import { runPrerender } from './prerender/runPrerender'
import type { PrerenderOptions } from './prerender/runPrerender'

async function prerender(options: PrerenderOptions = {}): Promise<void> {
  await runPrerender(options)
}
