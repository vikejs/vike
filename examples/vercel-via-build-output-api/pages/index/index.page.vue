<template>
  <h1>Hello from Vercel</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script>
import Counter from './Counter.vue'
const components = { Counter }
export default { components }
</script>
