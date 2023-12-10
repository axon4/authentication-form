/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './server/templates/**/*.{html,js,jsx,ts,tsx,njk}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				dark: {
					...require('daisyui/src/colors/themes')['[data-theme="dark"]'],
					primary: 'rgb(56, 189, 248)'
				}
			}
		]
	}
};