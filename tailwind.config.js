// FILE_PATH: tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{jsx,js,ts,tsx}",
    ],
    darkMode: 'class', // Aktiviere den class-basierten Dark Mode
    theme: {
      extend: {
        colors: {
          primary: "#4ade80", // Beibehaltung der Primary Farbe
          secondary: "#f472b6", // Beibehaltung der Secondary Farbe
          'dark-bg': "#121212",
          'dark-text': "#ffffff",
          'light-bg': "#f9f9f9", // Hinzufügen einer Light Mode Hintergrundfarbe
          'light-text': "#333333", // Hinzufügen einer Light Mode Textfarbe
          'gray-light': {      // Erweiterte Grautöne für Light Mode
            100: '#f3f4f6',    // Hellstes Grau für Hintergrundflächen
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',    // Mittleres Grau für Text/Icons
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',    // Dunkelstes Grau für Rahmen/Linien
          }
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