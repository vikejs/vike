// Ensure we don't bloat the client-side
import { isBrowser } from './isBrowser'
import { assert } from './assert'
assert(!isBrowser())
