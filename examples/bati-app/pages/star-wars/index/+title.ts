import type { PageContext } from "vike/types";
import type { Data } from "./+data.js";

export function title(pageContext: PageContext<Data>) {
  const movies = pageContext.data;
  return `${movies.length} Star Wars Movies`;
}
