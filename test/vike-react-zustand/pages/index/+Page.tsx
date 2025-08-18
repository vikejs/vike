export { Page }

import React from 'react'
import { Counter } from '../../components/Counter'
import { TodoList } from './TodoList'

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive while loading. <Counter />
        </li>
      </ul>
      <TodoList />
    </>
  )
}
