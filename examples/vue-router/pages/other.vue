<template>
  <main class="other-view">
    <h1>{{ msg }}</h1>
    <p>This page has an implicit route based on its page ID (no route file).</p>
  </main>
</template>
<script>
export default {
  props: {
    routes: Array,
    msg: String
  },
  setup() {
    return {}
  },
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>
