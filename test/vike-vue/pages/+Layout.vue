<template>
  <div class="layout">
    <div class="navigation">
      <a href="/" class="logo">
        <img src="../assets/logo.svg" height="64" width="64" />
      </a>
      <Link href="/">Welcome</Link>
      <Link href="/markdown">Markdown</Link>
      <Link href="/star-wars">Data Fetching</Link>
      <Link href="/starship">Nested Layout</Link>
      <Link href="/hello">Route Function</Link>
      <Link href="/without-ssr">Without SSR</Link>
      <Link href="/client-only">Client-only</Link>
      <Link href="/images">useConfig()</Link>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import Link from '../components/Link.vue'
import './global.css'
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
  flex-grow: 1;
}
.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
  border-right: 2px solid #eee;
}
.logo {
  margin-top: 20px;
  margin-bottom: 10px;
}
.content {
  transition: opacity 0.1s ease-in;
}
.content.page-transition {
  opacity: 0;
}
</style>
