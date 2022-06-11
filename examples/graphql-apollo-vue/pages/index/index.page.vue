<template>
  <div>
    <h1>Welcome to Vue 3 Apollo example</h1>
    <div>Name character: {{ result.character.name }}</div>
  </div>
</template>

<script>
import { gql } from '@apollo/client'
import { useQuery, useResult } from '@vue/apollo-composable'
const getChar = gql`
  query {
    character(id: 1) {
      id
      name
      __typename
    }
  }
`
export default {
  setup() {
    const { result } = useQuery(getChar)
    return { result }
  },
}
</script>
