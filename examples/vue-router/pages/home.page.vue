<template>
  <main class="home-view">
    <h1>{{ msg }}</h1>
    <p>{{ specialHomeMsg }}</p>
  </main>
</template>
<script>
export default {
  props: {
    routes: Array,
    msg: String,
    specialHomeMsg: String
  },
  setup() {
    return {}
  },
}
</script>

<style scoped>
h1 {
  color: green;
}
</style>
