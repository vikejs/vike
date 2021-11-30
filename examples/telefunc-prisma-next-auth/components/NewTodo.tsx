import { Session } from 'next-auth'
import React from 'react'
import { useState } from 'react'
import { addTodo } from '../telefunc/todo.telefunc'

export default function NewTodo({ refetch, session }: { refetch: () => void; session: Session }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!title || !content) return
        await addTodo({ title, content, author: session.user!.name!, authorEmail: session.user!.email! })
        setTitle('')
        setContent('')
        refetch()
      }}
    >
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  )
}
