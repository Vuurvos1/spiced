import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter Variable', ...defaultTheme.fontFamily.sans],
				sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
