import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";
import type { SetStateAction } from "react";

export default function Dashboard() {
  const { darkMode, toggleDarkMode, colors } = useTheme();

  return (
    <>
      <Sidebar darkMode={false} setDarkMode={function (value: SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
      } } />
      <div
        className="flex flex-col items-center justify-center min-h-screen transition-colors"
        style={{
          backgroundColor: darkMode ? "#111827" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Cores mockadas:</p>
        <div className="flex gap-4">
          <div
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>

        <button
          onClick={toggleDarkMode}
          className="mt-6 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Alternar para {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>
    </>
  );
}
