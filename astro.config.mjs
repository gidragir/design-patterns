// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import { remarkPatternTemplate } from './src/plugins/remark-pattern-template.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Паттерны проектирования',
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
            defaultLocale: 'ru',
            locales: {
                ru: {
                    label: 'Русский',
                },
                en: {
                    label: 'English',
                },
            },
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
            customCss: ['./src/styles/global.css'],
        }),
        react(),
        mdx({
            remarkPlugins: [remarkPatternTemplate],
        })
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});