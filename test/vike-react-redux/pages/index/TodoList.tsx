import { useState } from 'react'

import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addTodo, selectTodos } from '../../store/slices/todos'

export function TodoList() {
  const [newTodo, setNewTodo] = useState('')
  const dispatch = useAppDispatch()
  const todoItems = useAppSelector(selectTodos)
  return (
    <>
      <h2>To-Do</h2>
      <ul id="todo-list">
        {todoItems.map((todoItem, index) => (
          // biome-ignore:
          <li key={index}>{todoItem.text}</li>
        ))}
      </ul>
      <div>
        <form
          onSubmit={async (ev) => {
            ev.preventDefault()
            dispatch(addTodo(newTodo))
            setNewTodo('')
          }}
        >
          <input type="text" onChange={(ev) => setNewTodo(ev.target.value)} value={newTodo} />
          <button type="submit">Add to-do</button>
        </form>
      </div>
    </>
  )
}
