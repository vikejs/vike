<template>
  <h1>Without SSR</h1>
  This page is rendered only in the browser:
  <ul>
    <li>It's interactive. <Counter /></li>
    <li>It isn't rendered to HTML.</li>
  </ul>
</template>

<script lang="ts">
import Counter from '../../components/Counter.vue'
const components = { Counter }
export default { components }
</script>
