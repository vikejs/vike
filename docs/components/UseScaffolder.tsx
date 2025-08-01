export { UseScaffolder }

import { Link } from '@brillout/docpress'
import React from 'react'

function UseScaffolder({ children }: { children: string | React.ReactElement }) {
  return (
    <p>
      Go to <Link href="/new">vike.dev/new</Link> to scaffold a Vike app that uses {children}.
    </p>
  )
}
