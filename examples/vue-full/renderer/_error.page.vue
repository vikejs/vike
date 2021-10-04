<template>
  <div v-if="is404">
    <h1>404 Page Not Found</h1>
    This page could not be found.
  </div>
  <div v-else>
    <h1>500 Internal Server Error</h1>
    Something went wrong.
  </div>
</template>

<script lang="ts" setup>
defineProps(['is404'])
</script>
