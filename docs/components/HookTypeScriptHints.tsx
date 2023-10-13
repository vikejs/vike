export { HookTypeScriptHints }

import React from 'react'
import { assert, Link } from '@brillout/docpress'

function HookTypeScriptHints({ hookTypeName, wrongDefinition }: { hookTypeName: string; wrongDefinition: string }) {
  assert(hookTypeName)
  assert(wrongDefinition)
  return (
    <>
      <blockquote>
        <p>
          Do not omit the <code>ReturnType&lt;{hookTypeName}&gt;</code> annotation (i.e. do not write
          <code>{wrongDefinition}</code>), otherwise TypeScript won't strictly check the return type for unknown extra
          properties. See also:
          <ul>
            <li>
              <a href="https://stackoverflow.com/questions/63006497/typescript-why-not-strict-return-type">
                https://stackoverflow.com/questions/63006497/typescript-why-not-strict-return-type
              </a>
            </li>
            <li>
              <a href="https://stackoverflow.com/questions/57214325/typescript-excess-properties-are-not-checked-in-lambdas-without-explicit-return">
                https://stackoverflow.com/questions/57214325/typescript-excess-properties-are-not-checked-in-lambdas-without-explicit-return
              </a>
            </li>
          </ul>
        </p>
      </blockquote>
      <blockquote>
        <p>
          See <Link href="/pageContext#typescript" /> for more information on how to extend <code>pageContext</code>
          with your own extra properties.
        </p>
      </blockquote>
    </>
  )
}
