import { prerender } from 'vike/api'
await prerender()

import { assertGlobalContext } from './common.js'
await assertGlobalContext()
