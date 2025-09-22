import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBox,
  FiLayers,
  FiLayout,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { id: "produtos", label: "Produtos", to: "/produtos", icon: <FiBox /> },
  { id: "planos", label: "Planos", to: "/planos", icon: <FiLayers /> },
  { id: "temas", label: "Temas", to: "/temas", icon: <FiLayout /> },
  { id: "contas", label: "Contas", to: "/contas", icon: <FiUsers /> },
  { id: "config", label: "Configurações", to: "/configuracoes", icon: <FiSettings /> },
];

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(false);

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm";

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b dark:border-slate-700"
           style={{ backgroundColor: darkMode ? "#1E293B" : "#fff" }}>
        <span className="text-lg font-bold text-indigo-600">Fixisite</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 h-screen border-r`}
        style={{
          backgroundColor: darkMode ? "#1E293B" : "#fff",
          color: darkMode ? "#cbd5e1" : "#1e293b",
          borderColor: darkMode ? "#334155" : "#e5e7eb",
        }}
      >
        <div className="h-16 flex items-center justify-center font-bold text-xl text-indigo-600 border-b"
             style={{ borderColor: darkMode ? "#334155" : "#e5e7eb" }}>
          Fixi
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.to}
              key={item.id}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-indigo-50 text-indigo-700"
                    : darkMode
                    ? "hover:bg-slate-800 text-slate-300"
                    : "hover:bg-slate-100 text-slate-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t text-sm" style={{ borderColor: darkMode ? "#334155" : "#e5e7eb", color: darkMode ? "#94a3b8" : "#6b7280" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2"
          >
            {darkMode ? <FiMoon /> : <FiSun />}
            {darkMode ? "Modo Escuro" : "Modo Claro"}
          </button>
          {/* <div>© {new Date().getFullYear()} Fixi</div> */}
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative w-64 p-4 flex flex-col border-r"
            style={{
              backgroundColor: darkMode ? "#1E293B" : "#fff",
              color: darkMode ? "#cbd5e1" : "#1e293b",
              borderColor: darkMode ? "#334155" : "#e5e7eb",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-indigo-600">Fixi</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX size={22} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.id}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? darkMode
                          ? "bg-indigo-900/30 text-indigo-300"
                          : "bg-indigo-50 text-indigo-700"
                        : darkMode
                        ? "hover:bg-slate-800 text-slate-300"
                        : "hover:bg-slate-100 text-slate-700"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t text-sm flex items-center gap-2" style={{ borderColor: darkMode ? "#e5e7eb" : "#334155", color: darkMode ? "#6b7280" : "#94a3b8" }}>
              {darkMode ? <FiSun /> : <FiMoon />}
              <span>{darkMode ? "Modo Claro" : "Modo Escuro"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
