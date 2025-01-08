<template>
  <h1>My Vike + Vue app</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
  <Teleport to="#teleported">
    <p class="teleport">Teleported to the end of the body.</p>
  </Teleport>
</template>

<script lang="ts">
import Counter from '../../components/Counter.vue'
const components = { Counter }
export default { components }
</script>

<script lang="ts" setup>
import * as toastPlugin from 'vue-toast-notification'
import { onBeforeUnmount, onMounted } from 'vue'

const toast = toastPlugin.useToast()

onMounted(() => {
  toast.success('I am a Vue plugin.', {
    position: 'bottom',
    duration: 0, // infinite
  })
})

onBeforeUnmount(() => {
  toast.clear()
})
</script>

<style scoped>
/* show teleport in top left corner */
.teleport {
  position: fixed;
  top: 0;
  left: 0;
}
</style>

<style>
/* see https://stackoverflow.com/questions/55206901/how-to-import-css-files-in-vue-3-child-components */
@import 'vue-toast-notification/dist/theme-sugar.css';
</style>
