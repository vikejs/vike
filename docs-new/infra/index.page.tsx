import React from 'react'

export { Page }

function Page(pageContext: { routeParams: {url: string}}) {
  return <>hello {pageContext.routeParams.url}</>
}
