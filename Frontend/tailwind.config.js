/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: "selector",
  theme: {
    extend: {
      screens: {
        xsPhone: "180px",
        phone: "275px",
        mdPhone: "380px",
        xlPhone: "420px",
        smTablet: "580px",
        tablet: "800px",
        smLaptop: "1030px",
        laptop: "1490px",
        xlLaptop: "1520px",
        desktop: "2000px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        hover: "var(--hover)",
      },
    },
  },
  plugins: [],
};
