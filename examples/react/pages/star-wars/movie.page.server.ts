import fetch from "node-fetch";
import { MovieDetails } from "./types";

export { addPageContext };
export { filterMovieData };

type PageContext = {
  routeParams: {
    movieId: string;
  };
  pageProps: {
    movie: MovieDetails;
  };
  docTitle: string;
};

async function addPageContext({
  pageContext,
}: {
  pageContext: PageContext;
}): Promise<Partial<PageContext>> {
  const response = await fetch(
    `https://swapi.dev/api/films/${pageContext.routeParams.movieId}`
  );
  let movie = (await response.json()) as MovieDetails;

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie);

  // The page's <title>
  const docTitle = movie.title;

  return {
    pageProps: {
      movie,
    },
    docTitle,
  };
}

function filterMovieData(
  movie: MovieDetails & Record<string, unknown>
): MovieDetails {
  const { title, release_date, director, producer } = movie;
  movie = { title, release_date, director, producer };
  return movie;
}
