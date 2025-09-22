// src/pages/dashboard/Produtos.tsx
import React, { useState, type JSX } from "react";
import Sidebar from "../../components/Sidebar";
import { FiPlus, FiEdit, FiGlobe, FiTv, FiVideo, FiHome } from "react-icons/fi";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: string;
  status: "Ativo" | "Pausado";
}

interface Card {
  titulo: string;
  cor: "blue" | "purple" | "green" | "orange";
  icone: JSX.Element;
  planos: number;
  descricao: string;
}

const cardsData: Card[] = [
  { titulo: "Internet", cor: "blue", icone: <FiGlobe />, planos: 12, descricao: "Gerencie planos de internet banda larga" },
  { titulo: "IPTV", cor: "purple", icone: <FiTv />, planos: 8, descricao: "Gerencie pacotes de TV por IP" },
  { titulo: "Câmeras", cor: "green", icone: <FiVideo />, planos: 5, descricao: "Gerencie pacotes de segurança" },
  { titulo: "Casa Inteligente", cor: "orange", icone: <FiHome />, planos: 3, descricao: "Gerencie automação residencial" },
];

const produtosData: Produto[] = [
  { id: "#INT001", nome: "Internet 100MB", categoria: "Internet", preco: "R$ 99,90/mês", status: "Ativo" },
  { id: "#IPT001", nome: "IPTV Premium", categoria: "IPTV", preco: "R$ 59,90/mês", status: "Ativo" },
  { id: "#CAM001", nome: "Câmera HD", categoria: "Câmeras", preco: "R$ 29,90/mês", status: "Pausado" },
  { id: "#SHM001", nome: "Smart Home Básico", categoria: "Casa Inteligente", preco: "R$ 79,90/mês", status: "Ativo" },
];

const corCard: Record<Card["cor"], string> = {
  blue: "bg-blue-500 text-white",
  purple: "bg-purple-500 text-white",
  green: "bg-green-500 text-white",
  orange: "bg-orange-500 text-white",
};

const corPlano: Record<Card["cor"], string> = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  green: "bg-green-600",
  orange: "bg-orange-600",
};

const Produtos: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-slate-900"}`}>
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all">
            <FiPlus size={18} /> Adicionar Produto
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardsData.map((card) => (
            <div
              key={card.titulo}
              className={`rounded-xl shadow-md overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl ${darkMode ? "bg-slate-800" : "bg-white"}`}
            >
              <div className={`p-4 ${corCard[card.cor]}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xl">{card.icone}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${corPlano[card.cor]}`}>{card.planos} planos</span>
                </div>
                <h3 className="text-xl font-semibold mt-2">{card.titulo}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-white-600 dark:text-dark-300 mb-4">{card.descricao}</p>
                <div className="flex justify-between text-sm">
                  <a href="#" className={`hover:underline text-${card.cor}-500`}>Ver planos</a>
                  <button className="flex items-center gap-1 text-indigo-500 hover:text-gray-700 dark:hover:text-gray-200">
                    <FiEdit size={14} /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className={` rounded-xl shadow-md overflow-hidden`}>
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 ">
              <thead className={` ${darkMode ? "bg-slate-700 " : "bg-slate-100"}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-black-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {produtosData.map((produto) => (
                  <tr key={produto.id} className="hover:bg-white-50 dark:hover:bg-slate-700 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{produto.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{produto.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{produto.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{produto.preco}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        produto.status === "Ativo"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                      }`}>
                        {produto.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"><FiEdit size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Produtos;
