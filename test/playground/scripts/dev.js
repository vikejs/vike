import { dev } from 'vike/api'
await dev({ startupLog: true })

import { assertGlobalContext } from './common.js'
await assertGlobalContext()
