import { onNewTodo } from './TodoList.telefunc'
import React, { useState } from 'react'

export function TodoList({ initialTodoItems }: { initialTodoItems: { text: string }[] }) {
  const [todoItems, setTodoItems] = useState(initialTodoItems)
  const [newTodo, setNewTodo] = useState('')
  return (
    <>
      <ul>
        {todoItems.map((todoItem, index) => (
          // biome-ignore:
          <li key={index}>{todoItem.text}</li>
        ))}
      </ul>
      <div>
        <form
          onSubmit={async (ev) => {
            ev.preventDefault()

            // Optimistic UI update
            setTodoItems((prev) => [...prev, { text: newTodo }])
            try {
              await onNewTodo({ text: newTodo })
              setNewTodo('')
            } catch (e) {
              console.error(e)
              // rollback
              setTodoItems((prev) => prev.slice(0, -1))
            }
          }}
        >
          <input type="text" onChange={(ev) => setNewTodo(ev.target.value)} value={newTodo} />
          <button type="submit">Add to-do</button>
        </form>
      </div>
    </>
  )
}
