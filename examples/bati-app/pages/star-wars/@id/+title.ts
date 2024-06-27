import type { PageContext } from "vike/types";
import type { Data } from "./+data.js";

export function title(pageContext: PageContext<Data>) {
  const movie = pageContext.data;
  return movie.title;
}
