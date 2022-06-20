<template>
  <h1>To-do</h1>
  <span>{{ todo?.text }}</span>
  <br />
  <a href="/">Back</a>
</template>

<script setup>
import { onServerPrefetch, ref, onMounted } from 'vue'
import { usePageContext } from '../../renderer/usePageContext'
import { useTodos } from '../../stores/useTodos'

const props = defineProps(['todoId'])

const todo = ref()

const loadTodo = async (id) => {
  const idNum = parseInt(id)
  const todosStore = useTodos()
  await todosStore.fetchTodoById(idNum)
  todo.value = todosStore.todoById(idNum)
}

onServerPrefetch(async () => {
  // for this to work we need to pass routeParams (or whatever else we may need) to createApp in _default.page.server.js
  const { routeParams } = usePageContext()
  await loadTodo(routeParams.todoId)
})

onMounted(async () => {
  await loadTodo(props.todoId)
})
</script>
