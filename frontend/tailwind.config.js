/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        success: '#22c55e',
        danger: '#ef4444',
        background: '#f8fafc',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Sreda', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
