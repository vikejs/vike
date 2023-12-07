export default Page

import React from 'react'
import { useData } from '../../../renderer/useData'

function Page() {
  const data = useData()

  // We know that the data() hook fetched the data because otherwise it would
  // have raised a 503 and we wouldn't be here.
  const movie = data?.movie!

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
