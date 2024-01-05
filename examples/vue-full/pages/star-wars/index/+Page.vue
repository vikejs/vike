<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <li v-for="item in data.movies" :key="item.id">
      <a :href="'/star-wars/' + item.id">{{ item.title }}</a> ({{ item.release_date }})
    </li>
  </ol>
  <p>Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.</p>
  <p>Data can be fetched by using the <code>data()</code> hook.</p>
</template>

<script lang="ts" setup>
import type { Data } from './+data'
import { useData } from '../../../renderer/useData'
const data = useData<Data>()
</script>
