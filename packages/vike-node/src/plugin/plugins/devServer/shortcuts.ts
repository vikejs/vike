import readline from 'readline'
import { isatty } from 'tty'

export function bindCLIShortcuts({ onRestart }: { onRestart?: () => void }): void {
  if (!isatty(process.stdin.fd)) {
    return
  }
  const shortcuts = [
    {
      key: 'r',
      description: 'restart the server',
      async action() {
        onRestart?.()
      }
    }
  ]

  let actionRunning = false

  const onInput = async (input: string) => {
    if (actionRunning) return

    const shortcut = shortcuts.find((shortcut) => shortcut.key === input)
    if (!shortcut || shortcut.action == null) return

    actionRunning = true
    await shortcut.action()
    actionRunning = false
  }

  const rl = readline.createInterface({ input: process.stdin })
  rl.on('line', onInput)
}
