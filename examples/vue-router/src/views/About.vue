<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-09 17:38:07
-->
<template>
  <h1>{{ msg }}</h1>
  <p>The count is preserved when switching between "Home" and "About".</p>
</template>

<script lang="ts" setup>
const msg = 'About';
</script>

<style scoped>
h1 {
  color: red;
}
</style>
