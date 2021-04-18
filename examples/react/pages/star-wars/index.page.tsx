import React from "react";
import { Movie } from "./types";

export { Page };

function Page({ movies }: { movies: Movie[] }) {
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
        Source: <a href="https://swapi.dev/api/films/">swapi.dev/api/films/</a>.
      </p>
      <p>
        Data can be fetched by using the <code>addContextProps()</code> hook.
      </p>
    </>
  );
}
