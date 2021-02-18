<template>
  <div
    class="page-layout"
    style="display: none"
  >
    <div class="page-navigation">
      <a href="/" class="header">
        <img src="./logos/plugin.svg" height="30" />
        <img src="./logos/vue.svg" class="vue-logo" />
      </a>
      <a href="/markdown">Markdown</a>
      <a href="/star-wars">Data Fetching</a>
      <a href="/hello/alice">Routing</a>
      <a href="/zero-js">Zero JS</a>
    </div>
    <div class="page-content"><slot/></div>
  </div>
</template>

<style>
code {
  font-family: monospace;
  background-color: #eaeaea;
  padding: 2px 3px;
  border-radius: 4px;
}
pre {
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.page-layout {
  display: flex !important;
  max-width: 900px;
  margin: auto;
}
.page-content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
}
.page-navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
}
.header {
  margin-top: 20px;
  margin-bottom: 10px;
}

body {
  margin: 0;
  font-family: sans-serif;
  box-sizing: border-box;
  margin-top: 30px;
}

.vue-logo {
  position: relative;
  height: 16px;
  top: -14px;
  left: 2px;
  pointer-events: none;
}
</style>
