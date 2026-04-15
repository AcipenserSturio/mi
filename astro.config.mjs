// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { config } from "selo-components/config";

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

const deploy = import.meta.env.PROD
  ? { site: `https://${config.hostname}/` }
  : { site: "http://localhost/" };

// https://astro.build/config
export default defineConfig({
  ...deploy,
  integrations: [mdx(), sitemap(), svelte(), react()],
});