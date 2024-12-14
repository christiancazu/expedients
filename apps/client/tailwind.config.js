/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'layout-body': 'var(--ant-layout-body-bg)',
			},
		},
	},
	plugins: [],
}
