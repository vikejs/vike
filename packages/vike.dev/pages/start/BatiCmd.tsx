export { BatiCmd }

import { useState } from 'react'
import React from 'react'

// Cannot pass variable to code block: https://github.com/facebook/docusaurus/issues/5700
// - We could use a transformer that syntactically transform `PROPS.pckManager` to `props.pckManager`
//   - Props can be access from MDX (but not in code blocks), see https://mdxjs.com/playground
import BatiCmd_npm from './BatiCmd_npm.mdx'
import BatiCmd_pnpm from './BatiCmd_pnpm.mdx'
import BatiCmd_yarn from './BatiCmd_yarn.mdx'
import BatiCmd_bun from './BatiCmd_bun.mdx'

type PkgManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
function BatiCmd() {
  const [pkgManager, setPkgManager] = useState<PkgManager>('npm')
  const codeBlock = (() => {
    if (pkgManager === 'npm') return <BatiCmd_npm />
    if (pkgManager === 'pnpm') return <BatiCmd_pnpm />
    if (pkgManager === 'yarn') return <BatiCmd_yarn />
    if (pkgManager === 'bun') return <BatiCmd_bun />
  })()
  return (
    <>
      <div>
        {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
          <code onClick={() => setPkgManager(pm)}>{pm}</code>
        ))}
      </div>

      {codeBlock}
    </>
  )
}
