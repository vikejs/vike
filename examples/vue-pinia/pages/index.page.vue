<template>
  <h1>Pinia Example</h1>
  <h2>Counter that keeps its state on navigation</h2>
  <pre>{{ count }}</pre>
  <button type="button" @click="counterStore.increment">Increment Count</button>
  <h2>To-do List</h2>
  <ul>
    <li v-for="item in todoList" :key="item.id">
      <a :href="`/todos/${item.id}`">
        {{ item.text }}
      </a>
    </li>
  </ul>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { onServerPrefetch } from 'vue'
import { useCounter } from '../stores/useCounter'
import { useTodos } from '../stores/useTodos'

onServerPrefetch(async () => {
  const todosStore = useTodos()
  await todosStore.fetchTodoList()
})

const { todoList } = storeToRefs(useTodos())

const counterStore = useCounter()

const { count } = storeToRefs(counterStore)
</script>
