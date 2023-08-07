<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-04 17:39:02
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 19:39:11
-->
<template>
  <h1>Welcome to <code>vite-plugin-ssr</code>{{ userNameComputed }}</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive.
      <Counter />
    </li>
  </ul>
  <p>
    <button @click="randomNavigation">Random Page</button>
  </p>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { navigate } from 'vite-plugin-ssr/client/router'
import { getToken } from '@/utils/auth'
import Counter from '../components/Counter.vue'
import pinia from '../renderer/stores/store';
import { userStore } from '../renderer/stores/user';


const userExample = userStore(pinia);
const userNameComputed = computed(() => userExample.name);

const randomNavigation = () => {
  const randomIndex = Math.floor(Math.random() * 3)
  navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])
}

onMounted(() => {
  console.log('获取token', getToken());
});

</script>
../renderer/stores/user