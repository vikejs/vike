<template>
  <div class="g-layout-container">
    <header class="g-layout">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/test">Test</router-link>
    </header>
    <main class="g-layout">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </main>
    <footer class="g-layout">
      Powered by <a href="https://github.com/brillout/vite-plugin-ssr">vite-plugin-ssr</a>
    </footer>
  </div>
</template>

<script setup>

</script>

<style>
html,body{
  padding: 0;
  margin: 0;
  height: 100%;
  font-size: 16px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
div.g-layout-container{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 700px;
  padding: 0 50px;
}
header.g-layout{
  flex: 0;
  position: sticky;
  top: 0px;
  z-index: 1000;
  opacity: 1;
  background: #fff;
  padding-top: 20px;
  text-align: center;
}
main.g-layout{
  flex: 1;
  padding: 10px;
  position: relative;
}
footer.g-layout{
  flex: 0;
  text-align: center;
  padding: 5px 0;
}
footer.g-layout a{
  text-decoration: none;
}
</style>
