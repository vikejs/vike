export { isRunnableDevEnvironment }

import type { Environment, RunnableDevEnvironment } from 'vite'

// We use this instead of `import { isRunnableDevEnvironment } from 'vite'` because:
// - Vite's isRunnableDevEnvironment() isn't reliable in monorepos where multiple Vite instances can be used simultaneously (it uses `instanceof RunnableDevEnvironment` which fails)
// - We can use this in Vike's server production runtime without having to load the 'vite' package
function isRunnableDevEnvironment(environment: Environment | undefined): environment is RunnableDevEnvironment {
  return !!environment && 'runner' in environment && !!environment.runner
}
