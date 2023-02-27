<template>
  <h1>Welcome to <code>vite-plugin-ssr</code></h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
  <p>
    <button @click="randomNavigation">Random Page</button>
  </p>
</template>

<script lang="ts" setup>
import Counter from '../components/Counter.vue'
import { navigate } from 'vite-plugin-ssr/client/router'

const randomNavigation = () => {
  const randomIndex = Math.floor(Math.random() * 3)
  navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])
}
</script>
