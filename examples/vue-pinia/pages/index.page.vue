<template>
  <h1>Pinia Example</h1>
  <span>Counter that keeps its state on navigation</span>:
  <button type="button" @click="counterStore.increment">Counter {{ count }}</button>
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
