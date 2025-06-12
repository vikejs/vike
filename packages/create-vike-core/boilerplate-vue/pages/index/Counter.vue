<template>
  <button type="button" @click="state.count++">Counter {{ state.count }}</button>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({ count: 0 })
</script>
