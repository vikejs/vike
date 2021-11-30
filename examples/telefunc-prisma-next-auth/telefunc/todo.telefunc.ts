import { PrismaClient } from '@prisma/client'
import { getUser } from './utils'

const prisma = new PrismaClient()

export { addTodo, getTodos, toggleTodo, deleteTodo }

async function getTodos({ authorEmail }: { authorEmail: string }) {
  const user = getUser()

  if (!user) {
    throw new Error('Not logged in')
  }
  if (user.email !== authorEmail) {
    throw new Error('Not authorized')
  }

  const todos = await prisma.todo.findMany({ where: { authorEmail } })
  return todos
}

async function addTodo({
  title,
  content,
  author,
  authorEmail,
}: {
  title: string
  content: string
  author: string
  authorEmail: string
}) {
  const user = getUser()

  if (!user) {
    throw new Error('Not logged in')
  }
  if (user.email !== authorEmail) {
    throw new Error('Not authorized')
  }

  await prisma.todo.create({
    data: {
      author,
      authorEmail,
      title,
      content,
      completed: false,
    },
  })
}

async function toggleTodo(id: number) {
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  })
  if (!todo) {
    throw new Error('Todo not found')
  }

  const user = getUser()

  if (!user) {
    throw new Error('Not logged in')
  }
  if (user.email !== todo.authorEmail) {
    throw new Error('Not authorized')
  }

  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      completed: !todo.completed,
    },
  })
}

async function deleteTodo(id: number) {
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  })
  if (!todo) {
    throw new Error('Todo not found')
  }

  const user = getUser()

  if (!user) {
    throw new Error('Not logged in')
  }
  if (user.email !== todo.authorEmail) {
    throw new Error('Not authorized')
  }

  await prisma.todo.delete({
    where: {
      id,
    },
  })
}
