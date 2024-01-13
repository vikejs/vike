<template>
  <div class="center">
    <p>{{ abortReason }}</p>
  </div>
</template>

<script lang="ts" setup>
import { usePageContext } from '../../renderer/usePageContext'

const pageContext = usePageContext()
let { is404, abortReason } = pageContext
if (!abortReason) {
  abortReason = is404 ? 'Page not found.' : 'Something went wrong.'
}
</script>

<style>
.center {
  height: calc(100vh - 100px);
  display: flex;
  font-size: 1.3em;
  justify-content: center;
  align-items: center;
}
</style>
