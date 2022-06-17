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
  <div style="margin-top: 20px; border: 1px solid black; padding: 10px 50px">
    <Overview v-if="pageContext.routeParams.innerRoute === 'overview'" />
    <Reviews v-if="pageContext.routeParams.innerRoute === 'reviews'" />
    <Spec v-if="pageContext.routeParams.innerRoute === 'spec'" />
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
import Overview from './Overview.vue'
import Reviews from './Reviews.vue'
import Spec from './Spec.vue'
import Counter from './Counter.vue'
import DummyText from './DummyText.vue'
import { usePageContext } from '../../renderer/usePageContext'
const pageContext = usePageContext()
</script>
