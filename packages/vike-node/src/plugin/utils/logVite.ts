export { logViteInfo }

import pc from '@brillout/picocolors'

function logViteInfo(message: string) {
  console.log(`${pc.bold(pc.cyan('[vite]'))} ${message}`)
}
