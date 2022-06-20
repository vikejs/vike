<template>
  <h1>To-do</h1>
  <span>{{ text }}</span>
  <br />
  <a href="/">Back</a>
</template>

<script setup>
import { onServerPrefetch, computed } from 'vue'
import { useTodos } from '../../stores/useTodos'

const props = defineProps(['todoId'])

onServerPrefetch(async () => {
  const todosStore = useTodos()
  await todosStore.fetchTodoList()
})
const todosStore = useTodos()

const text = computed(() => {
  const todo = todosStore.todoById(parseInt(props.todoId))
  console.log('todo.text', todo?.text)
  return todo?.text
})
</script>
