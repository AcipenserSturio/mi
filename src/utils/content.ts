import { getCollection } from "astro:content";

// utilities

export const by =
  <T>(key: (x: T) => any, ascending: boolean = true) =>
  (a: T, b: T) =>
    (ascending ? 1 : -1) * (key(a) > key(b) ? 1 : -1);

// posts
export const posts = await getCollection("blog");
