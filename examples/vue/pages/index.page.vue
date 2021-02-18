<template>
  <h1>
    Welcome to <code>vite-plugin-ssr</code>
  </h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>
      Interactive. <Counter />
    </li>
  </ul>
</template>

<script lang="ts">
import Counter from '../components/Counter.vue';

export default {
  props: ['url'],
  components: {
    Counter
  }
}
</script>
