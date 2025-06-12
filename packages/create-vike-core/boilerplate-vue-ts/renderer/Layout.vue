<template>
  <div id="page-container">
    <div id="sidebar">
      <a href="/" id="logo-container">
        <img src="./logo.svg" height="64" width="64" alt="logo" />
      </a>
      <Link href="/">Welcome</Link>
      <Link href="/about">About</Link>
      <Link href="/star-wars">Data Fetching</Link>
    </div>
    <div id="page-content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'
import './css/index.css'
</script>

<style>
#sidebar a {
  padding: 2px 10px;
  margin-left: -10px;
}
#sidebar a.is-active {
  background-color: #eee;
}
</style>

<style scoped>
#page-container {
  display: flex;
  max-width: 900px;
  margin: auto;
}
#page-content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
}
#sidebar {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
  border-right: 2px solid #eee;
}
#logo-container {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
