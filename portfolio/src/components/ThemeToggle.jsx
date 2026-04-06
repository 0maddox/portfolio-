import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}