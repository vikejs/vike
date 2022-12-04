export { CSSinJSTool }

import React from 'react'

function CSSinJSTool({ prefix }: { prefix: string }) {
  return (
    <>
      <p>{prefix} collect the page's styles while server-side rendering the page to HTML.</p>

      <p>
        This enables us to add the styles to the HTML so that the browser loads the styles before loading the
        JavaScript.
      </p>
    </>
  )
}
