export { UseScaffolder }

import { Link } from '@brillout/docpress'
import React from 'react'

function UseScaffolder({ children }: { children: string | React.ReactElement }) {
  return (
    <p>
      Use <Link href="/new">vike.dev/new</Link> to scaffold a new Vike app that uses {children}.
    </p>
  )
}
