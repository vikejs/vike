import { useEffect, useState } from 'react'

import React from 'react'
import { useTodoStore } from '../../store'
import { useStoreVanilla } from 'vike-react-zustand'

export function TodoList() {
  const [newTodo, setNewTodo] = useState('')
  const { todoItems, addTodo } = useTodoStore()
  const storeVanilla = useStoreVanilla(useTodoStore)
  useEffect(
    () =>
      storeVanilla.subscribe((state) => {
        console.log(JSON.stringify(state.todoItems))
      }),
    [],
  )

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
            addTodo({ text: newTodo })
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
