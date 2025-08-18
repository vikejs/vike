<template>
  <h1>Vike + Vue + Pinia</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive.</li>
  </ul>
  <TodoList />
  <h2>Counters synced via shared store</h2>
  <Counter id="counter-1" />
  <hr />
  <Counter id="counter-2"/>
</template>

<script lang="ts" setup>
import { onServerPrefetch } from 'vue'
import Counter from '../../components/Counter.vue'
import { useCounterStore } from '../../stores/useCounterStore'
import TodoList from './TodoList.vue'

const { increment } = useCounterStore()
onServerPrefetch(() => {
  // Show that hydration works - the counter should start at 1
  increment()
})
</script>
