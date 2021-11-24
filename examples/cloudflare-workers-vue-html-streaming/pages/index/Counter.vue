<template>
  <button type="button" @click="state.count++">Counter {{ state.count }}</button>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup(props) {
    const state = reactive({ count: 0 })
    return {
      state,
    }
  },
}
</script>
