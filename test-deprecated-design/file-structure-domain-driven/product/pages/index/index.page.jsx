import React from 'react'

export { Page }

function Page({ routeParams }) {
  return <>Product {routeParams.productId}</>
}
