export { UseBati }

import React from 'react'

function UseBati({ feature }: { feature: string | React.ReactElement }) {
  return (
    <>
      Use <a href="https://batijs.github.io/">Bati</a> to scaffold a Vike app using {feature}.
    </>
  )
}
