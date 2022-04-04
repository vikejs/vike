<script setup>
import { useCounterStore } from '../../renderer/stores/counter'
const counterStore = useCounterStore();  
</script>

<template>
  <div>
    <h1>Counter page</h1>
		<h2>Count is: {{ counterStore.countValue }}</h2>
		<button @click.prevent="counterStore.increment()" class="btn" type="button">Increment</button>
		<button @click.prevent="counterStore.decrement()" class="btn" type="button">Decrement</button>
  </div>
</template>
