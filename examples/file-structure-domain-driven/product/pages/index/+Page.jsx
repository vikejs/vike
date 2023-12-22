export default Page

import React from 'react'

function Page({ routeParams }) {
  return <>Product {routeParams.productId}</>
}
