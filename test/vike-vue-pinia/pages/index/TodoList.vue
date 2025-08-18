<template>
  <h3>To-Do</h3>
  <ul id="todo-list">
    <li v-for="todo in todos" :key="todo.text">
      {{ todo.text }}
    </li>
  </ul>
  <form @submit.prevent="handleSubmit">
    <input v-model="newTodo" type="text" />
    <button type="submit">Add to-do</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTodoStore } from '../../stores/useTodoStore'
import { storeToRefs } from 'pinia'

const { todos } = storeToRefs(useTodoStore())
const { addTodos } = useTodoStore()

const newTodo = ref('')

const handleSubmit = () => {
  addTodos([{ text: newTodo.value }])
  newTodo.value = ''
}
</script>
