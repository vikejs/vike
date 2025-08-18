<template>
  <button type="button" @click="counterStore.increment">Counter {{ counterStore.count }}</button>
</template>

<script lang="ts" setup>
import { useCounterStore } from '../stores/useCounterStore'

const counterStore = useCounterStore()
</script>
