export { Page }

import { useData } from '../../../renderer/useData'

function Page() {
  const { movie } = useData()
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
