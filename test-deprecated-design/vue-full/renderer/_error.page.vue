<template>
  <div v-if="pageContext.is404">
    <h1>404 Page Not Found</h1>
    <p>This page could not be found.</p>
    <p>{{ errorInfo }}</p>
  </div>
  <div v-else>
    <h1>500 Internal Error</h1>
    <p>Something went wrong.</p>
  </div>
</template>

<script lang="ts" setup>
import { usePageContext } from './usePageContext'
defineProps(['errorInfo'])
const pageContext = usePageContext()
</script>
