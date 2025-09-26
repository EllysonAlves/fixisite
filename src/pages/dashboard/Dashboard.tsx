import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { darkMode, toggleDarkMode, colors } = useTheme();

  const data = [
    { name: "Jan", uv: 400 },
    { name: "Fev", uv: 300 },
    { name: "Mar", uv: 500 },
    { name: "Abr", uv: 250 },
    { name: "Mai", uv: 600 },
  ];

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-slate-900"}`}>
      <Sidebar />
      <div
        className="flex flex-col w-full min-h-screen transition-colors p-6"
        style={{
          backgroundColor: darkMode ? "#111827" : "#f9fafb",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📊 Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Alternar para {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: colors.primary, color: "#fff" }}
          >
            <h2 className="text-lg">Usuários</h2>
            <p className="text-2xl font-bold">1,245</p>
          </div>
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: colors.secondary, color: "#fff" }}
          >
            <h2 className="text-lg">Vendas</h2>
            <p className="text-2xl font-bold">R$ 32.400</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg bg-green-500 text-white">
            <h2 className="text-lg">Novos Leads</h2>
            <p className="text-2xl font-bold">320</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg bg-red-500 text-white">
            <h2 className="text-lg">Tickets Abertos</h2>
            <p className="text-2xl font-bold">18</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Visitas Mensais</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <LineChart data={data}>
                <Line type="monotone" dataKey="uv" stroke={colors.primary} strokeWidth={3} />
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                <XAxis dataKey="name" stroke={darkMode ? "#aaa" : "#333"} />
                <YAxis stroke={darkMode ? "#aaa" : "#333"} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
