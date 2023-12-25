<template>
  <div>
    <h1>Welcome to Vue 3 Apollo example</h1>
    <p>List of countries.</p>
    <ul>
      <li v-for="country in result.countries" :key="country.code">{{ country.name }}</li>
    </ul>
  </div>
</template>

<script>
import { gql } from '@apollo/client'
import { useQuery, useResult } from '@vue/apollo-composable'
export default {
  setup() {
    const { result } = useQuery(gql`
      {
        countries {
          code
          name
        }
      }
    `)
    return { result }
  }
}
</script>
