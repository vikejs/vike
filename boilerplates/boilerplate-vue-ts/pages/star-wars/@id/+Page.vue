<template>
  <h1>{{ data.movie.title }}</h1>
  Release Date: {{ data.movie.release_date }}
  <br />
  Director: {{ data.movie.director }}
  <br />
  Producer: {{ data.movie.producer }}
</template>

<script lang="ts" setup>
import type { Data } from './+data'
import { useData } from '../../../renderer/useData'
const data = useData<Data>()
</script>
