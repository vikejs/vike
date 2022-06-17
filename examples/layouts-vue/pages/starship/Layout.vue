<template>
  <LayoutDefault>
    <PageOuter>
      <slot />
    </PageOuter>
  </LayoutDefault>
</template>

<script>
import LayoutDefault from '../../renderer/LayoutDefault.vue'
import PageOuter from './PageOuter.vue'
const components = { PageOuter, LayoutDefault }
export default { components }
</script>
