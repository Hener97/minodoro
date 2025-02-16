// FILE_PATH: src\components\ThemeToggle.jsx
import { createSignal, onMount } from "solid-js";

function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = storedTheme === "dark" || (!storedTheme && prefersDark);
    setIsDark(dark);
    updateTheme(dark);
  });

  const toggleTheme = () => {
    const newTheme = !isDark();
    setIsDark(newTheme);
    updateTheme(newTheme);
  };

  const updateTheme = (dark) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-full hover:bg-gray-light-200 dark:hover:bg-gray-700 transition-colors duration-200" // Light Mode Hover Hintergrundfarbe, transition
      aria-label={`Switch to ${isDark() ? "light" : "dark"} mode`}
    >
      {isDark() ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-400 transition-colors duration-200" // transition hinzugefügt
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-orange-500 transition-colors duration-200" // transition hinzugefügt
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;