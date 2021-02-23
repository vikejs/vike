import React from "react";

export { Page };

function Page({
  starWarsMovies,
}: {
  starWarsMovies: { title: string; release_date: string }[];
}) {
  return (
    <>
      <h1>Star Wars movies</h1>
      <ol>
        {starWarsMovies.map(({ title, release_date }) => (
          <li key={title}>
            {title}, {release_date}.
          </li>
        ))}
      </ol>
      <p>
        Source: <a href="https://swapi.dev/api/films/">swapi.dev/api/films/</a>.
      </p>
      <p>
        Data can be fetched by using <code>addContextProps</code> and{" "}
        <code>setPageProps</code>.
      </p>
    </>
  );
}
