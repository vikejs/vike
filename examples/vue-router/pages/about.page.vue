<template>
  <main class="about-view">
    <h1>{{ msg }}</h1>
    <p>The count is preserved when switching between "Home" and "About".</p>
  </main>
</template>

<script>
export default {
  props: {
    routes: Array,
    msg: String
  },
  async setup() {
    return {}
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>
