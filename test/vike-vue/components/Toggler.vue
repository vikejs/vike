<template>
  <button type="button" @click="state.status = state.status !== true">
    <template v-if="state.status !== null">
      <slot name="prefix">State is </slot>
      <slot :status="state.status">{{ state.status ? 'On' : 'Off' }}</slot>
    </template>
    <slot v-else name="fallback">No state</slot>
  </button>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: boolean | null
  }>(),
  {
    status: false,
  },
)

const emit = defineEmits<{
  toggle: [value: boolean | null]
}>()

defineSlots<{
  default: { status: boolean }
  prefix: {}
  fallback: {}
}>()

const state = reactive({ status: false as boolean | null })

watch(
  () => props.status,
  (val) => {
    state.status = val
  },
  { immediate: true },
)

watch(
  () => state.status,
  (val) => {
    emit('toggle', val)
  },
)
</script>
