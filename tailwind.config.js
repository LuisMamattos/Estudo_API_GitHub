/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 100%, 50%)", // azul principal
        "primary-foreground": "hsl(0, 0%, 100%)", // texto/icons sobre primary
        secondary: "hsl(200, 90%, 60%)", // azul secundário mais claro
        "secondary-foreground": "hsl(0, 0%, 100%)",
        background: "hsl(220, 20%, 98%)", // fundo geral claro
        foreground: "hsl(222, 47%, 11%)", // texto principal
      },
    },
  },
  plugins: [],
};
