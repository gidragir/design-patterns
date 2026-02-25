// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSiteGraph from 'starlight-site-graph';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
			title: 'Паттерны проектирования',
			plugins: [
          starlightSiteGraph({
              // здесь можно указать настройки графа
          })
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
          {
              label: 'Patterns',
              autogenerate: { directory: 'patterns' },
          },
          {
              label: 'Pattern Types',
              autogenerate: { directory: 'pattern_types' },
          },
			],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});