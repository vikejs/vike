export default Page

import React from 'react'
import { gql, useQuery } from '@apollo/client'

function Page() {
  const { data } = useQuery(gql`
    {
      countries {
        code
        name
      }
    }
  `)

  return (
    <>
      <ul>{data && data.countries.map((country) => <li key={country.code}>{country.name}</li>)}</ul>
    </>
  )
}
