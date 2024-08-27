import pc from '@brillout/picocolors'
import { version } from './version.js'

export function logVikeNode(message: string) {
  console.log(`${pc.cyan(`vike-node v${version}`)} ${pc.green(message)}`)
}
