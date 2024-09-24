export default Page

import React from 'react'
import type { Data } from './+data'
import { useData } from 'vike-react/useData'

function Page() {
  const movie = useData<Data>()
  return (
    <>
      <h1>{movie.title}</h1>
      Release Date: {movie.release_date}
      <br />
      Director: {movie.director}
      <br />
      Producer: {movie.producer}
    </>
  )
}
