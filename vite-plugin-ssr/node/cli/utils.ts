// Ensure we don't bloat the client-side with node utils
import { isBrowser } from '../../utils/isBrowser'
import { assert } from '../../utils/assert'
assert(!isBrowser())

export * from '../../utils/assert'
export * from '../../utils/projectInfo'
