<template>
  <h1>{{ msg }}</h1>
  <p>{{ specialHomeMsg }}</p>
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
