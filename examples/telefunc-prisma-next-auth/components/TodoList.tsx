import { Todo } from '@prisma/client'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { deleteTodo, getTodos, toggleTodo } from '../telefunc/todo.telefunc'
import NewTodo from './NewTodo'

export { TodoList }

function TodoItem({ refetch, ...todo }: Todo & { refetch: () => void; session: Session | null }) {
  return (
    <li key={todo.id}>
      <h2>
        {todo.title}{' '}
        <button
          id={'toggle-' + todo.title}
          onClick={async () => {
            await toggleTodo(todo.id)
            refetch()
          }}
        >
          {todo.completed ? '✅ done' : '❌ undone'}
        </button>
      </h2>
      <p>{todo.content}</p>
      <button
        id={'remove-' + todo.title}
        onClick={async () => {
          await deleteTodo(todo.id)
          refetch()
        }}
      >
        remove
      </button>
    </li>
  )
}

function TodoList({ session }: { session: Session }) {
  const [todoItems, setTodoItems] = useState<Todo[]>([])

  const fetch = async () => {
    setTodoItems(await getTodos({ authorEmail: session.user!.email! }))
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <>
      <hr />
      <NewTodo session={session} refetch={fetch} />
      <hr />
      <ul>
        {todoItems.map((todoItem, i) => (
          <TodoItem session={session} key={i} refetch={fetch} {...todoItem} />
        ))}
      </ul>
    </>
  )
}
