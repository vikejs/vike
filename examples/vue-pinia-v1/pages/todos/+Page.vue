<template>
  <h1>To-do</h1>
  <span>{{ todo?.text }}</span>
  <br />
  <a href="/">Back</a>
</template>

<script setup>
import { onServerPrefetch, ref, onMounted, computed } from 'vue'
import { usePageContext } from '../../renderer/usePageContext'
import { useTodos } from '../../stores/useTodos'

const pageContext = usePageContext()
const todoId = parseInt(pageContext.routeParams.todoId)

const todosStore = useTodos()

const todo = computed(() => todosStore.todoById(todoId))

const loadTodo = async () => {
  await todosStore.fetchTodoById(todoId)
}
onServerPrefetch(loadTodo)
onMounted(loadTodo)
</script>
