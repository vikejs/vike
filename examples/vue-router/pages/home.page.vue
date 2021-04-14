<template>
  <h1>{{ msg }}</h1>
  <p>This content is rendered to HTML.</p>
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
  color: green;
}
</style>
