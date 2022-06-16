<template>
  <LayoutDefault>
    <h1>Starship 🚀</h1>
    <p>
      <b>
        This page uses the default layout <code>/renderer/LayouDefault.jsx</code>.
        <br />
        With the nested layout <code>/pages/starship/Layout.jsx</code>.
      </b>
    </p>
    <p>Outer layout is preserved during nested layout navigation: <Counter /></p>
    <div class="sub-navigation">
      <a href="/starship/">Overview</a> <a href="/starship/reviews">Reviews</a>
      <a href="/starship/spec">Tech Spec</a>
    </div>
    <div style="margin-top: 20px"><slot /></div>
  </LayoutDefault>
</template>

<script>
import Counter from './Counter.vue'
import LayoutDefault from '../../renderer/LayoutDefault.vue'
const components = { Counter, LayoutDefault }
export default { components }
</script>

<style>
.sub-navigation a {
  margin-right: 10px;
}
</style>
