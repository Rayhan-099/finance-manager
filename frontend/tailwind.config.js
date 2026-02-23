/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#010103',
                surface: '#0F0F12',
                primary: '#3A41B2',
                'primary-dark': '#1A1999',
                success: '#00C896',
                warning: '#FF4C61',
                textMain: '#DEE1E5',
                textSecondary: '#9B9AA2',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
