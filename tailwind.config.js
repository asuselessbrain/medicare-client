/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "node_modules/flowbite-react/lib/esm/**/*.js",
    ],
    theme: {
        extend: {
            fontFamily:{
                'Inter':['Inter', 'sans-serif'],
                'Quicksand':['Quicksand', 'sans-serif'],
                'DancingScript':['Dancing Script', 'cursive'],
                
            },
            colors: {
                'primary': '#183E9F',
                'secondary': '#183E9F',
            }
        },
    },
    darkMode: "class",
    plugins: [require('flowbite/plugin')],
};
