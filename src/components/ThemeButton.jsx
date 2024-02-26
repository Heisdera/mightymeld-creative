import { useEffect, useState } from "react";

function ThemeButton() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // first set the state to light when u are done u save it to localStorage
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const preferDarkMode = darkModeQuery.matches;

  function handleToggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  useEffect(
    function () {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.theme = "dark";
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
      }
    },
    [theme]
  );

  useEffect(
    function () {
      const storedTheme = localStorage.getItem("theme");

      if (
        storedTheme === "dark" ||
        (!("theme" in localStorage) && preferDarkMode)
      ) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    },
    [preferDarkMode]
  );

  darkModeQuery.addEventListener("change", (e) => {
    if (e.matches === true) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  });

  return (
    <button
      className="relative dark:text-white self-end bg-gray-200 rounded-[20px] w-20 h-9 dark:bg-gray-500 transition-all duration-500"
      onClick={(e) => handleToggleTheme(e)}
    >
      <div
        className={`absolute w-7 h-7 top-1 ${
          theme === "dark" ? "left-[48px] bg-black" : "left-1 bg-white"
        } rounded-full transition-all duration-500`}
      ></div>
    </button>
  );
}

export default ThemeButton;
