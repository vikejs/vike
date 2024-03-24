<template>
  <template v-for="(component,i) of components" :key="`${component}-${i}`">
    <component :is="component" />
  </template>
</template>

<script setup>
const components = [
  'Test1',
  'Test2',
];
</script>
