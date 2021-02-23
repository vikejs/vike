<!--
  In development Vite loads CSS dynamically leading to a flickering effect.
  The <ViteAntiFlicker> component removes the flickering.
-->

<template>
  <div id="vite-anti-flicker" style="display: none">
    <slot />
  </div>
</template>

<style scoped>
#vite-anti-flicker {
  display: inherit !important;
}
</style>
