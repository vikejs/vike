<template>
  <h1>To-do List</h1>
  <ul>
    <li v-for="item in todoList" :key="item.id">{{ item.text }}</li>
  </ul>
</template>

<script>
export default {
  serverPrefetch() {
    return this.$store.dispatch('fetchTodoList')
  },
  computed: {
    todoList() {
      return this.$store.state.todoList
    },
  },
}
</script>
