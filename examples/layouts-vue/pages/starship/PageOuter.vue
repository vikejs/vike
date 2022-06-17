<template>
  <h1>Starship 🚀</h1>
  <p>
    <b>
      This page uses the default layout <code>/renderer/LayouDefault.vue</code>.
      <br />
      With the nested layout <code>/pages/starship/Layout.vue</code>.
    </b>
  </p>
  <p>
    <b> Outer layout is preserved when navigating the nested layout: <Counter /> </b>
  </p>
  <br />
  <div class="sub-navigation">
    <a keep-scroll-position href="/starship">Overview</a> <a keep-scroll-position href="/starship/reviews">Reviews</a>
    <a keep-scroll-position href="/starship/spec">Tech Spec</a>
  </div>
  <div style="margin-top: 20px; border: 1px solid black; padding: 10px 50px"><slot /></div>
  <br />
  <p>
    <b>The scroll position is preserved when navigating the nested layout.</b>
  </p>
  <DummyText />
</template>

<style>
.sub-navigation a {
  margin-right: 10px;
}
</style>

<script>
import Counter from './Counter.vue'
import DummyText from './DummyText.vue'
const components = { Counter, DummyText }
export default { components }
</script>
