<template>
  <h1>Starship 🚀</h1>
  <p>
    <b>
      This page uses the layout <code>/pages/+Layout.vue</code> with a nested layout
      <code>/pages/starship/+Layout.vue</code>.
    </b>
  </p>
  <p>
    <b>
      State is preserved upon navigating within the nested layout. Click on the counter then on the links below:
      observe how the counter state is preserved.
    </b>
    <Counter />
  </p>
  <br />
  <div class="sub-navigation">
    <a keep-scroll-position href="/starship">Overview</a>
    <a keep-scroll-position href="/starship/reviews">Reviews</a>
    <a keep-scroll-position href="/starship/spec">Tech Spec</a>
  </div>
  <div style="margin-top: 20px; border: 1px solid black; padding: 10px 40px">
    <slot />
  </div>
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

<script setup>
import Counter from './Counter.vue'
import DummyText from './DummyText.vue'
import { usePageContext } from 'vike-vue/usePageContext'
const pageContext = usePageContext()
</script>
