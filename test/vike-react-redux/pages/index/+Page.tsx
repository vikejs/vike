import React from 'react'
import { Counter } from '../../components/Counter'
import { TodoList } from './TodoList'

export default function Page() {
  return (
    <>
      <h1>My Vike app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <TodoList />
    </>
  )
}
