import fetch from "node-fetch";
import { MovieDetails } from "./types";

export { addContextProps };
export { setPageProps };

type ContextProps = {
  movieId: string;
  movie: MovieDetails;
  title: string;
};

async function addContextProps({
  contextProps,
}: {
  contextProps: ContextProps;
}): Promise<Partial<ContextProps>> {
  const filmId = contextProps.movieId;
  const response = await fetch(`https://swapi.dev/api/films/${filmId}`);
  const movie = (await response.json()) as MovieDetails;

  // The page's <title>
  const { title } = movie;

  return { movie, title };
}

function setPageProps({ contextProps }: { contextProps: ContextProps }) {
  // We remove data we don't need: (`vite-plugin-ssr` serializes and passes `pageProps`
  // to the client; we want to minimize what it sent over the network.)
  const { title, release_date, director, producer } = contextProps.movie;
  const movie = { title, release_date, director, producer };
  return { movie };
}
