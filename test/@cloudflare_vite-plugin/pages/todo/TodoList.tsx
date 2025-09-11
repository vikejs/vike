export { TodoList }

import React, { useState } from 'react'
import { useData } from 'vike-react/useData'
import { onNewTodo, onReset } from './TodoList.telefunc'
import type { Data } from './+data.js'

function TodoList() {
  const data = useData<Data>()
  const [todoItems, setTodoItems] = useState(data.todoItemsInitial)
  const [draft, setDraft] = useState('')
  return (
    <>
      <ul>
        {todoItems.map((todoItem, i) => (
          <li key={i}>{todoItem.text}</li>
        ))}
        <li>
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const { todoItems } = await onNewTodo({ text: draft })
              setDraft('')
              setTodoItems(todoItems)
            }}
          >
            <input type="text" onChange={(ev) => setDraft(ev.target.value)} value={draft} autoFocus={true} />{' '}
            <button type="submit">Add to-do</button>
          </form>
        </li>
      </ul>
      <button
        onClick={async () => {
          const { todoItems } = await onReset()
          setTodoItems(todoItems)
        }}
      >
        Reset
      </button>
    </>
  )
}
