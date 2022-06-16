<template>
  <div class="layout">
    <div class="navigation">
      <a class="navitem" href="/">Home</a>
      <a class="navitem" href="/about">About</a>
      <a class="navitem" href="/starship">Starship</a>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 100vh;
}
.navigation {
  padding: 20px;
  padding-top: 42px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
.navitem {
  padding: 3px;
}
</style>
