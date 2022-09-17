<template>
    <h1>Testing</h1>
    <div>
        <div>{{data}}</div>
        <input v-model="newData" />
        <button type="button" @click="updData">new Data</button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '../store/store'

const data=computed(()=>store.state.data);
const newData=ref("");
const updData=function(){
  store.commit('setData',newData.value)
}


</script>

<style scoped>

</style>
  