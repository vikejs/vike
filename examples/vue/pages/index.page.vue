<template>
  <h1>Welcome to <code>vite-plugin-ssr</code></h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
  <p>
    We use <code>useClientRouter()</code> to do Client-side Routing.
    <button @click="randomNavigation">Random Page</button>
  </p>
</template>

<script lang="ts">
import Counter from './_components/Counter.vue'
import { navigate } from 'vite-plugin-ssr/client/router'

const components = { Counter }

const randomNavigation = () => {
  const randomIndex = Math.floor(Math.random() * 3)
  navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])
}
const methods = { randomNavigation }

export default { components, methods }
</script>
