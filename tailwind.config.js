// FILE_PATH: tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{jsx,js,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4ade80",
          secondary: "#f472b6",
          "dark-bg": "#121212",
          "dark-text": "#ffffff",
        },
        fontFamily: {
          sans: [
            "ui-sans-serif",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "Noto Sans",
            "sans-serif",
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            "Noto Color Emoji",
          ],
        },
      },
    },
    plugins: [],
  };
  