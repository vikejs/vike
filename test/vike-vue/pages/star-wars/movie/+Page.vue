<template>
  <h1>{{ movie.title }}</h1>
  Release Date: {{ movie.release_date }}
  <br />
  Director: {{ movie.director }}
  <br />
  Producer: {{ movie.producer }}
</template>

<script lang="ts" setup>
import type { Data } from './+data'
import { useData } from 'vike-vue/useData'
const movie = useData<Data>()
</script>
