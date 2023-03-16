export { prerender }

import { runPrerender } from './runPrerender'
import type { PrerenderOptions } from './runPrerender'

async function prerender(options: PrerenderOptions = {}): Promise<void> {
  await runPrerender(options)
}
