import React from 'react'

export { Page }

function Page() {
  return (
    <>
      <div>Product list:</div>
      <ul>
        <li>
          <a href="/product/7">Product 7</a>
        </li>
        <li>
          <a href="/product/42">Product 42</a>
        </li>
        <li>
          <a href="/product/1337">Product 1337</a>
        </li>
      </ul>
    </>
  )
}
