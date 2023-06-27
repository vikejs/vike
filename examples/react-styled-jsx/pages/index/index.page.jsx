export { Page }

import React from 'react'
import { Counter } from './Counter'

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is: <span>styled</span>
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <style jsx>{`
        span {
          color: firebrick; 
        }
    
      `}</style>
    </>
  )
}
