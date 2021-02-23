<template>
  <h1>Star Wars movies</h1>
  <ol>
    <li v-for="item in starWarsMovies" :key="item.message">
      {{item.title}}, {{item.release_date}}.
    </li>
  </ol>
  <p>
    Source: <a href="https://swapi.dev/api/films/">swapi.dev/api/films/</a>.
  </p>
  <p>
    Data can be fetched by using <code>addContextProps</code> and
    <code>setPageProps</code>.
  </p>
</template>

<script lang="ts">
const props = ['starWarsMovies']
export default { props }
</script>
