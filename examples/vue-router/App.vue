<template>
  <div>
    <nav>
      <router-link class="nav-route" :to="{ name: '/pages/about' }">
        About
      </router-link> | <router-link class="nav-route" :to="{ name: '/pages/home' }">
        Home
      </router-link> | <router-link class="nav-route" to="/other" >
        Other
      </router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
  <div>
    <button @click="increment">count is: {{ count }}</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
  },
  setup() {
    const count = ref(0);
    return {
      count,
      increment() {
        count.value++
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
