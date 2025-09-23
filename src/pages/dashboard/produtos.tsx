import React, { useState, useEffect, type JSX } from "react";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import { FiPlus, FiEdit, FiGlobe, FiTv, FiVideo, FiHome, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

interface Produto {
  id: string;
  name: string;
  enterprise_id: string;
}

interface Plano {
  nome: string;
  preco: string;
  produtoId: string;
}

// Planos mockados com associação ao produto
const planosMock: Plano[] = [
  { nome: "Plano Básico", preco: "R$ 49,90", produtoId: "1" },
  { nome: "Plano Intermediário", preco: "R$ 79,90", produtoId: "1" },
  { nome: "Plano Premium", preco: "R$ 119,90", produtoId: "3" },
];

// Cores e ícones padrão para os cards
const cores = ["blue", "purple", "green", "orange"] as const;
const icones: Record<string, JSX.Element> = {
  Internet: <FiGlobe />,
  IPTV: <FiTv />,
  Câmeras: <FiVideo />,
  "Casa Inteligente": <FiHome />,
};

const corCard: Record<typeof cores[number], string> = {
  blue: "bg-blue-500 text-white",
  purple: "bg-purple-600 text-white",
  green: "bg-green-500 text-white",
  orange: "bg-orange-500 text-white",
};

const corPlano: Record<typeof cores[number], string> = {
  blue: "bg-blue-700",
  purple: "bg-purple-700",
  green: "bg-green-700",
  orange: "bg-orange-700",
};

const Produtos: React.FC = () => {
  const { darkMode } = useTheme();

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState<Produto | null>(null);
  const [modalDelete, setModalDelete] = useState<Produto | null>(null);
  const [produtosData, setProdutosData] = useState<Produto[]>([]);
  const [filtroProduto, setFiltroProduto] = useState<string>("todos");
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);


  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return toast.error("Token não encontrado");
      try {
        const produtos = await getProducts(token);
        setProdutosData(produtos);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Erro ao buscar produtos");
      }
    };
    fetchProducts();
  }, [token]);

  // Filtra planos pelo produto selecionado
  const planosFiltrados = filtroProduto === "todos"
    ? planosMock
    : planosMock.filter((plano) => plano.produtoId === filtroProduto);

  // Lida com clique simples/duplo no card
  const handleCardClick = (produto: Produto) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      setModalDelete(produto); // clique duplo abre modal de deletar
    } else {
      const timer = setTimeout(() => {
        setModalEdit(produto); // clique simples abre modal de editar
        setClickTimer(null);
      }, 250); // 250ms para detectar duplo clique
      setClickTimer(timer);
    }
  };

  // Adicionar Produto
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return toast.error("Token não encontrado");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const enterprise_id = (form.elements.namedItem("enterprise_id") as HTMLInputElement).value;

    if (!name || !enterprise_id) return toast.error("Preencha todos os campos");

    try {
      const res = await addProduct(token, { name, enterprise_id });
      setProdutosData((prev) => [...prev, res]);
      setModalAdd(false);
      toast.success("Produto adicionado com sucesso");
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao adicionar produto");
    }
  };

  // Editar Produto
  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !modalEdit) return toast.error("Token ou produto inválido");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const enterprise_id = (form.elements.namedItem("enterprise_id") as HTMLInputElement).value;

    if (!name || !enterprise_id) return toast.error("Preencha todos os campos");

    try {
      const res = await updateProduct(token, modalEdit.id, { name, enterprise_id });
      setProdutosData((prev) => prev.map((p) => p.id === modalEdit.id ? res : p));
      setModalEdit(null);
      toast.success("Produto atualizado com sucesso");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar produto");
    }
  };

  // Deletar Produto
  const handleDeleteProduct = async () => {
    if (!token || !modalDelete) return toast.error("Token ou produto inválido");
    try {
      await deleteProduct(token, { id: modalDelete.id, name: modalDelete.name, enterprise_id: modalDelete.enterprise_id });
      setProdutosData((prev) => prev.filter((p) => p.id !== modalDelete.id));
      setModalDelete(null);
      toast.success("Produto deletado com sucesso");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao deletar produto");
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-slate-900"}`}>
      <Toaster position="top-right" />
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Gerenciamento de Produtos</h1>
          <button
            onClick={() => setModalAdd(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all"
          >
            <FiPlus size={18} /> Adicionar Produto
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {produtosData.map((produto, index) => {
            const cor = cores[index % cores.length];
            const icone = icones[produto.name] || <FiGlobe />;
            return (
              <div
                key={produto.id}
                onClick={() => handleCardClick(produto)}
                className={`rounded-xl shadow-md overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer ${darkMode ? "bg-slate-800" : "bg-white border border-gray-200"}`}
              >
                <div className={`p-4 ${corCard[cor]}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{icone}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${corPlano[cor]}`}>Produto</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{produto.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtro por produto */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filtrar por produto:</label>
          <select
            value={filtroProduto}
            onChange={(e) => setFiltroProduto(e.target.value)}
            className={`border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`}
          >
            <option value="todos">Todos</option>
            {produtosData.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Products Table - Planos */}
        <div className={`rounded-xl shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className={`${darkMode ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-800"}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? "bg-slate-700 text-slate-200 divide-slate-600" : "bg-white text-gray-800 divide-gray-200"}`}>
                {planosFiltrados.map((plano, index) => {
                  const produto = produtosData.find((p) => p.id === plano.produtoId);
                  return (
                    <tr key={index} className={`hover:${darkMode ? "bg-slate-600" : "bg-gray-50"} transition-all`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{produto?.name || "Produto não encontrado"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{plano.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{plano.preco}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">
                          <FiEdit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <Modal open={modalAdd} onClose={() => setModalAdd(false)} title="Adicionar Produto">
          <form className="space-y-4" onSubmit={handleAddProduct}>
            <input name="name" type="text" placeholder="Nome" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <input name="enterprise_id" type="text" placeholder="Enterprise ID" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Salvar</button>
          </form>
        </Modal>

        <Modal open={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar Produto">
          {modalEdit && (
            <form className="space-y-4" onSubmit={handleEditProduct}>
              <input name="name" defaultValue={modalEdit.name} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <input name="enterprise_id" defaultValue={modalEdit.enterprise_id} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Atualizar</button>
            </form>
          )}
        </Modal>

        <Modal open={!!modalDelete} onClose={() => setModalDelete(null)} title="Deletar Produto">
          {modalDelete && (
            <div className="space-y-4">
              <p>Tem certeza que deseja deletar o produto <strong>{modalDelete.name}</strong>?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalDelete(null)}
                  className="px-4 py-2 rounded border"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default Produtos;
