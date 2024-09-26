export { HookTypeScriptHints }

import React from 'react'
import { assert, Link } from '@brillout/docpress'

function HookTypeScriptHints({ hookTypeName }: { hookTypeName: `${string}Sync` | `${string}Async` }) {
  // Ensure hookTypeName starts with an upper case
  assert(hookTypeName[0] !== hookTypeName[0].toLowerCase(), hookTypeName)

  let hookName: string
  let isSync: boolean
  if (hookTypeName.endsWith('Sync')) {
    hookName = hookTypeName.slice(0, -1 * 'Sync'.length)
    isSync = true
  } else if (hookTypeName.endsWith('Async')) {
    hookName = hookTypeName.slice(0, -1 * 'Async'.length)
    isSync = false
  } else {
    assert(false, hookTypeName)
  }

  hookName = hookName[0].toLowerCase() + hookName.slice(1)

  return (
    <>
      <blockquote>
        <p>
          Don't omit <code>ReturnType&lt;{hookTypeName}&gt;</code> otherwise TypeScript{' '}
          <a href="https://www.typescriptlang.org/play/?#code/PTAEEkDNQTwewK6jgWwJYBdQAMBKBTDBAJwDsAVGAB321AwAt9TRKaBlAY2LSqwHc4pAORZOTTgGt6TUMUIkWGavlCQ4xUAlKTScfi3wAPDMQCGoKsTg1iGNPgDOAOgBQIUAwwYqjgFwgAOaYDAgARs6cqMDo3HCOcJAYwGz4XDx8wGiOjghOwACsACwAbCUAjK6uyjSgAGIsALygABRUZuYofqCOpmikgQCUoI0AfKAA3qBm3aQIKGH4mgC+VR6AMuSgAOrWA1qOZoH4rlGkvWqk5d0NI63tncNjrROuoNPd5QA0r6AbrCrpXhYAAmcCcIjEqCoABszP0fmFugAmVzLQZrMCAUHJQABhDTyThYBAHI4nITnSCkJHXJp3DpmFCDboEIhkVIAHga4yeLRebxmoC+Pw82NSgL4oCiKBhcLOCORqMGQA">
            won't strictly check the return type
          </a>
          .
        </p>
      </blockquote>
      <blockquote>
        <p>
          See <Link href="/pageContext#typescript" /> for more information on how to extend <code>pageContext</code>{' '}
          with your own extra properties.
        </p>
      </blockquote>
    </>
  )
}
