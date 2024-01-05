<template>
  <a :class="{ active: isActive }">
    <slot />
  </a>
</template>
<style scoped>
a {
  padding: 2px 10px;
  margin-left: -10px;
}
a.active {
  background-color: #eee;
}
</style>
<script lang="ts" setup>
import { useAttrs, computed } from 'vue'
import { usePageContext } from './usePageContext'

const pageContext = usePageContext()
const { href } = useAttrs() as { href: string }
const isActive = computed(() => {
  const { urlPathname } = pageContext
  return href === '/' ? urlPathname === href : urlPathname.startsWith(href)
})
</script>
