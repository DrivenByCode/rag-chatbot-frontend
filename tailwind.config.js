/** @types {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // HTML 파일 포함
    "./src/**/*.{js,ts,jsx,tsx}" // React 컴포넌트 파일 포함
  ],
  theme: {
    extend: {
      animation: {
        fade: "fade 1.5s ease-in-out"
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0, transform: "translateY(-4px)" },
          "30%": { opacity: 1, transform: "translateY(0px)" },
          "100%": { opacity: 0, transform: "translateY(-4px)" }
        }
      }
    }
  },
  plugins: []
};
