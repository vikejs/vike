<template>
  <h1>Home {{ userNameComputed }}</h1>
  <p>This content is rendered to HTML.</p>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import pinia from '@/stores/store';
import { userStore } from '@/stores/user';

const userExample = userStore(pinia);
const userNameComputed = computed(() => userExample.name);
</script>

<style scoped>
h1 {
  color: green;
}
</style>
