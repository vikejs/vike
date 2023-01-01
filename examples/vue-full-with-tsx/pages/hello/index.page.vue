<template>
  <h1>Hello</h1>
  <p>
    Hi <b>{{ name }}</b
    >.
  </p>
  <ul>
    <li>
      <a href="/hello/eli">/hello/eli</a>
    </li>
    <li>
      <a href="/hello/jon">/hello/jon</a>
    </li>
  </ul>
  <p>
    Parameterized routes can be defined by exporting a route string in
    <code>*.page.route.js</code>.
  </p>
</template>

<script lang="ts" setup>
defineProps(['name'])
</script>
