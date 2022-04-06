<script setup>
import { useCounterStore } from '../../renderer/stores/counter'
const counterStore = useCounterStore();  
</script>

<template>
  <div>
		<h2>Counter {{ counterStore.countValue }}</h2>
		<button @click.prevent="counterStore.increment()" class="btn" type="button">Increment</button>
		<button @click.prevent="counterStore.decrement()" class="btn" type="button">Decrement</button>
  </div>
</template>
