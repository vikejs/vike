export { TodoList }

import React, { useState } from 'react'
import { onNewTodo } from './TodoList.telefunc.js'
import type { Todo } from '@prisma/client'

function TodoList({ todoItemsInitial }: { todoItemsInitial: Todo[] }) {
  const [todoItems, setTodoItems] = useState(todoItemsInitial)
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
    </>
  )
}
