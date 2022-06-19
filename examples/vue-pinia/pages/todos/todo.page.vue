<template>
  <span>{{ todo?.text }}</span>
  <br />
  <a href="/">Back</a>
</template>

<script setup>
import { onServerPrefetch, computed } from 'vue'
import { useTodos } from '../../stores/useTodos'

const props = defineProps(['todoId'])

onServerPrefetch(async () => {
  const todosStore = useTodos()
  if (todosStore.todoList.length === 0) {
    await todosStore.fetchTodoList()
  }
})
const todosStore = useTodos()

const todo = computed(() => todosStore.todoById(parseInt(props.todoId)))
</script>
