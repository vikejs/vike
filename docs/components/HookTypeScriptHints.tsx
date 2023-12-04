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
          Don't omit <code>ReturnType&lt;{hookTypeName}&gt;</code> (don't write{' '}
          <code>{`const ${hookName}: ${hookTypeName} = ${isSync ? '' : 'async '}(pageContext) => {`}</code>), otherwise
          TypeScript won't strictly check the return type for unknown extra properties: see this TypeScript{' '}
          <a href="https://www.typescriptlang.org/play?#code/C4TwDgpgBAYgdlAvFAFGAhgJ3QWwFxQDOwmAlnAOYCUSAfFAN5ToFwCuOARhJlAL4AoAQHphUQDLkUAOqYA9pShtC6ChAEBjecSgAzOAEYC8JKgzYcNRPRQMBUZgX0AaO1FESoAFXAQAyurIwYCgAE1kIQjgAcmDNHDAAG3RyV04CACYBPiohd0BQcigAYVlMTAh1YKUVNU04bT10owRkNCxcKgIAJQhgNkw4b0gAHnh6K1RbexYoZ1d8rx9-QNjZeKTyQlSMrKogA">
            playground
          </a>{' '}
          and <a href="https://github.com/microsoft/TypeScript/issues/54661">issue</a>.
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
