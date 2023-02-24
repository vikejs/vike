export { todoItems }
export type { TodoItem }

type TodoItem = { text: string }
const todoItems: TodoItem[] = []
init()

// Initial data
function init() {
  todoItems.push({ text: 'Buy milk' })
  todoItems.push({ text: 'Buy strawberries' })
}
