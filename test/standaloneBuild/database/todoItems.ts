export { init, getTodoItems, createTodoItem }

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getTodoItems = () => prisma.todo.findMany()
const createTodoItem = ({ text }: { text: string }) => prisma.todo.create({ data: { text } })

// Initial data
async function init() {
  await prisma.todo.deleteMany()
  await prisma.todo.create({ data: { text: 'Buy milk' } })
  await prisma.todo.create({ data: { text: 'Buy strawberries' } })
}
