export default Page

import { useData } from '../../../renderer/useData'

function Page() {
  const { movies } = useData()
  return (
    <>
      <h1>Star Wars Movies</h1>
      <ol>
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
          </li>
        ))}
      </ol>
      <p>
        Source: <a href="https://brillout.github.io/star-wars/">brillout.github.io/star-wars</a>.
      </p>
      <p>
        Data can be fetched by using the <code>data()</code> hook.
      </p>
    </>
  )
}
