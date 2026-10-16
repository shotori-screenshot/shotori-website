// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// Deployed on Vercel at https://shotori.mengh04.top (Aliyun DNS, CNAME to
	// cname.vercel-dns.com); `site` feeds the sitemap and canonical URLs, so
	// keep it in sync with the domain configured in the Vercel project.
	site: 'https://shotori.mengh04.top',
	integrations: [
		starlight({
			title: 'Shotori',
			description:
				'Wayland-native screenshot tool — select, annotate, pin, long-capture scrolling pages, and read text with on-device OCR.',
			logo: { alt: 'Shotori', src: './src/assets/shotori.svg' },
			customCss: ['./src/styles/custom.css'],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/shotori-screenshot/shotori',
				},
			],
			locales: {
				// English is the root locale: content lives at the docs root and
				// is served without a URL prefix. `defaultLocale: 'en'` would
				// instead expect content under docs/en/ with an /en/ prefix.
				root: { label: 'English', lang: 'en' },
				'zh-cn': {
					label: '简体中文',
					lang: 'zh-CN',
					// Sidebar labels are shared across locales; map them per locale.
					translations: {
						'Getting Started': '快速开始',
					},
				},
			},
			defaultLocale: 'root',
			sidebar: [
				{
					label: 'Getting Started',
					items: [{ autogenerate: { directory: 'getting-started' } }],
				},
			],
		}),
		react(),
	],
	// Tailwind drives only the landing page (see src/styles/landing.css, which
	// skips preflight on purpose so Starlight's docs styles stay untouched).
	vite: {
		plugins: [tailwindcss()],
	},
});
