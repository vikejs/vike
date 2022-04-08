export { rootApp }

import { existsSync } from 'fs'

const rootApp = process.cwd()
if (!existsSync(`${rootApp}/package.json`)) {
  throw new Error("The `framework` CLI should be called from your project's root directory.")
}
