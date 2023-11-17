export { UseBatiInsteadHint }

import React from 'react'
import { Link } from '@brillout/docpress'

function UseBatiInsteadHint({
  featureName,
  additionalHint
}: {
  featureName: string
  additionalHint?: React.ReactElement
}) {
  if (additionalHint) {
    additionalHint = <>{additionalHint} and </>
  } else {
    additionalHint = <></>
  }

  return (
    <>
      <blockquote>
        <p>
          Instead of manually integrating {featureName} yourself, you can use{' '}
          <Link
            text={
              <>
                <code>vike-*</code> packages
              </>
            }
            href="/vike-packages"
          />{' '}
          and <a href="https://batijs.github.io/">Bati</a>. {additionalHint} Bati helps you scaffold Vike projects. Bati
          and <code>vike-*</code> packages are going to get out of beta soon.
        </p>
      </blockquote>
    </>
  )
}
