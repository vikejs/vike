<template>
  <div v-if="is404">
    <h1>404 Page Not Found</h1>
    <p>This page could not be found.</p>
  </div>
  <div v-else>
    <h1>500 Internal Error</h1>
    <p>Something went wrong.</p>
  </div>
</template>

<script setup>
defineProps(['is404'])
</script>
