<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <li v-for="item in movies" :key="item.id">
      <a :href="'/star-wars/' + item.id">{{ item.title }}</a> ({{ item.release_date }})
    </li>
  </ol>
  <p>Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.</p>
  <p>Data can be fetched by using the <code>addPageContext()</code> hook.</p>
</template>

<script lang="ts">
const props = ['movies']
export default { props }
</script>
