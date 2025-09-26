import React, { useState, useEffect, type JSX } from "react";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiTv, FiVideo, FiHome } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import {
  getProducts,
  getPlans,
  addProduct,
  updateProduct,
  deleteProduct,
  addPlan,
  updatePlan,
  deletePlan
} from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

interface Produto {
  id: string;
  name: string;
  tenant_id: string;
  description?: string;
  price?: string;
  stock?: number;
}

interface Plano {
  id: string;
  name: string;
  description: string;
  price: number | string;
  tenant_id: string;
  product_id: string;
  benefits: string[];
}

const cores = ["blue", "purple", "green", "orange"] as const;
const icones: Record<string, JSX.Element> = {
  Internet: <FiGlobe />,
  IPTV: <FiTv />,
  "Câmeras": <FiVideo />,
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
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
  const tenant_id = user?.tenant_id;

  const [produtosData, setProdutosData] = useState<Produto[]>([]);
  const [planosData, setPlanosData] = useState<Plano[]>([]);
  const [filtroProduto, setFiltroProduto] = useState<string>("todos");

  const [modalAddProduto, setModalAddProduto] = useState(false);
  const [modalEditProduto, setModalEditProduto] = useState<Produto | null>(null);
  const [modalDeleteProduto, setModalDeleteProduto] = useState<Produto | null>(null);

  const [modalPlanos, setModalPlanos] = useState<Produto | null>(null);
  const [modalAddPlano, setModalAddPlano] = useState(false);
  const [modalEditPlano, setModalEditPlano] = useState<Plano | null>(null);

  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return toast.error("Token não encontrado");
      try {
        const [produtos, planos] = await Promise.all([getProducts(token), getPlans(token)]);
        setProdutosData(produtos);
        setPlanosData(
          planos.map((plano: any) => ({
            id: plano.id,
            name: plano.name,
            description: plano.description ?? "",
            price: plano.price,
            tenant_id: plano.tenant_id ?? "",
            product_id: plano.product_id ?? "",
            benefits: plano.benefits ?? []
          }))
        );
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Erro ao carregar dados");
      }
    };
    fetchData();
  }, [token]);

  const handleCardClick = (produto: Produto) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      setModalDeleteProduto(produto); // duplo clique
    } else {
      const timer = setTimeout(() => {
        setModalEditProduto(produto); // clique simples
        setClickTimer(null);
      }, 250);
      setClickTimer(timer);
    }
  };

  // Produto CRUD
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !tenant_id) return toast.error("Token ou tenant não encontrado");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLInputElement)?.value || "";
    const price = (form.elements.namedItem("price") as HTMLInputElement)?.value || "";
    const stock = Number((form.elements.namedItem("stock") as HTMLInputElement)?.value || "0");
    if (!name || !description || !price) return toast.error("Preencha todos os campos obrigatórios");
    try {
      const res = await addProduct(token, {
        tenant_id,
        name,
        description,
        price,
        stock
      });
      setProdutosData((prev) => [...prev, res]);
      setModalAddProduto(false);
      toast.success("Produto adicionado com sucesso");
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao adicionar produto");
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !modalEditProduto || !tenant_id) return toast.error("Produto inválido");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    if (!name) return toast.error("Preencha o nome do produto");
    try {
      const res = await updateProduct(token, modalEditProduto.id, { name, tenant_id });
      setProdutosData((prev) => prev.map((p) => p.id === modalEditProduto.id ? res : p));
      setModalEditProduto(null);
      toast.success("Produto atualizado com sucesso");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar produto");
    }
  };

  const handleDeleteProduct = async () => {
    if (!token || !modalDeleteProduto) return toast.error("Produto inválido");
    try {
      await deleteProduct(token, {
        id: modalDeleteProduto.id,
        name: modalDeleteProduto.name,
        enterprise_id: modalDeleteProduto.tenant_id
      });
      setProdutosData((prev) => prev.filter((p) => p.id !== modalDeleteProduto.id));
      setModalDeleteProduto(null);
      toast.success("Produto deletado com sucesso");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao deletar produto");
    }
  };

// Adicionar Plano
const handleAddPlano = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!token || !modalPlanos || !tenant_id) return toast.error("Produto ou tenant inválido");
  const form = e.currentTarget;
  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  const description = (form.elements.namedItem("description") as HTMLInputElement).value;
  let price = (form.elements.namedItem("price") as HTMLInputElement).value;
  const benefitsRaw = (form.elements.namedItem("benefits") as HTMLInputElement).value;
  if (!name || !description || !price) return toast.error("Preencha todos os campos obrigatórios");
  price = price.replace(",", ".");
  const benefits = benefitsRaw.split("\n").map(b => b.trim()).filter(b => b);
  try {
    await addPlan(token, {
      tenant_id,
      name,
      description,
      price: price,
      product_id: modalPlanos.id,
      benefits
    });
    const planosAtualizados = await getPlans(token);
    setPlanosData(
      planosAtualizados.map((plano: any) => ({
        id: plano.id,
        name: plano.name,
        description: plano.description ?? "",
        price: plano.price,
        tenant_id: plano.tenant_id ?? "",
        product_id: plano.product_id ?? "",
        benefits: plano.benefits ?? []
      }))
    );
    setModalAddPlano(false);
    toast.success("Plano adicionado com sucesso");
    form.reset();
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Erro ao adicionar plano");
  }
};

// Editar Plano
const handleEditPlano = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!token || !modalEditPlano || !tenant_id) return toast.error("Plano ou tenant inválido");
  const form = e.currentTarget;
  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  const description = (form.elements.namedItem("description") as HTMLInputElement).value;
  let price = (form.elements.namedItem("price") as HTMLInputElement).value;
  const benefitsRaw = (form.elements.namedItem("benefits") as HTMLInputElement).value;
  if (!name || !description || !price) return toast.error("Preencha todos os campos obrigatórios");
  price = price.replace(",", ".");
  const benefits = benefitsRaw.split("\n").map(b => b.trim()).filter(b => b);
  try {
    await updatePlan(token, modalEditPlano.id, {
      tenant_id,
      name,
      description,
      price: price,
      product_id: modalEditPlano.product_id,
      benefits
    });
    const planosAtualizados = await getPlans(token);
    setPlanosData(
      planosAtualizados.map((plano: any) => ({
        id: plano.id,
        name: plano.name,
        description: plano.description ?? "",
        price: plano.price,
        tenant_id: plano.tenant_id ?? "",
        product_id: plano.product_id ?? "",
        benefits: plano.benefits ?? []
      }))
    );
    setModalEditPlano(null);
    toast.success("Plano atualizado com sucesso");
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Erro ao atualizar plano");
  }
};

// Deletar Plano
const handleDeletePlano = async (id: string) => {
  if (!token) return toast.error("Plano inválido");
  try {
    await deletePlan(token, id);
    const planosAtualizados = await getPlans(token);
    setPlanosData(
      planosAtualizados.map((plano: any) => ({
        id: plano.id,
        name: plano.name,
        description: plano.description ?? "",
        price: plano.price,
        tenant_id: plano.tenant_id ?? "",
        product_id: plano.product_id ?? "",
        benefits: plano.benefits ?? []
      }))
    );
    toast.success("Plano deletado com sucesso");
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Erro ao deletar plano");
  }
};



  const planosFiltrados = filtroProduto === "todos" ? planosData : planosData.filter(p => p.product_id === filtroProduto);

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-slate-900"}`}>
      <Toaster position="top-right" />
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Gerenciamento de Produtos</h1>
          <button onClick={() => setModalAddProduto(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all">
            <FiPlus size={18} /> Adicionar Produto
          </button>
        </div>

        {/* Cards de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {produtosData.map((produto, index) => {
            const cor = cores[index % cores.length];
            const icone = icones[produto.name] || <FiGlobe />;
            const planosRelacionados = planosData.filter(p => p.product_id === produto.id);

            return (
              <div key={produto.id} onClick={() => handleCardClick(produto)} className={`rounded-xl shadow-md overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer ${darkMode ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                <div className={`p-4 ${corCard[cor]}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{icone}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${corPlano[cor]}`}>
                      {planosRelacionados.length} {planosRelacionados.length === 1 ? "plano" : "planos"}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{produto.name}</h3>
                  <button onClick={(e) => { e.stopPropagation(); setModalPlanos(produto); }} className="mt-2 text-sm text-indigo-100 hover:text-white underline">
                    Gerenciar Planos
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtro de Planos */}
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="filtroProduto">Filtrar por produto:</label>
          <select id="filtroProduto" value={filtroProduto} onChange={e => setFiltroProduto(e.target.value)} className="border rounded p-1">
            <option value="todos">Todos</option>
            {produtosData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Tabela de Planos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className={`${darkMode ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-800"}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Benefícios</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "bg-slate-700 text-slate-200 divide-slate-600" : "bg-white text-gray-800 divide-gray-200"}`}>
              {planosFiltrados.map(plano => {
                const produtoNome = produtosData.find(p => p.id === plano.product_id)?.name || "N/A";
                return (
                  <tr key={plano.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{produtoNome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{plano.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{plano.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {Number(plano.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ul className="list-disc pl-4">
                        {plano.benefits?.map((b: any, i: number) => (
                          <li key={i}>{typeof b === "string" ? b : b.description}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button onClick={() => setModalEditPlano(plano)} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">
                        <FiEdit size={16} />
                      </button>
                      <button onClick={() => handleDeletePlano(plano.id)} className="text-red-600 hover:text-red-800">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modals Produtos */}
        <Modal open={modalAddProduto} onClose={() => setModalAddProduto(false)} title="Adicionar Produto">
          <form className="space-y-4" onSubmit={handleAddProduct}>
            <input name="name" type="text" placeholder="Nome" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <input name="description" type="text" placeholder="Descrição" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <input name="price" type="text" placeholder="Preço" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <input name="stock" type="number" placeholder="Estoque" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Salvar</button>
          </form>
        </Modal>

        <Modal open={!!modalEditProduto} onClose={() => setModalEditProduto(null)} title="Editar Produto">
          {modalEditProduto && (
            <form className="space-y-4" onSubmit={handleEditProduct}>
              <input name="name" defaultValue={modalEditProduto.name} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              {/* Removido input de tenant_id */}
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Atualizar</button>
            </form>
          )}
        </Modal>

        <Modal open={!!modalDeleteProduto} onClose={() => setModalDeleteProduto(null)} title="Deletar Produto">
          {modalDeleteProduto && (
            <div className="space-y-4">
              <p>Tem certeza que deseja deletar o produto <strong>{modalDeleteProduto.name}</strong>?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setModalDeleteProduto(null)} className="px-4 py-2 rounded border">Cancelar</button>
                <button onClick={handleDeleteProduct} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Deletar</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal Planos */}
        <Modal open={!!modalPlanos} onClose={() => setModalPlanos(null)} title={`Planos de ${modalPlanos?.name}`}>
          {modalPlanos && (
            <div>
              <button onClick={() => setModalAddPlano(true)} className="mb-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                <FiPlus size={16} /> Adicionar Plano
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className={`${darkMode ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-800"}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? "bg-slate-700 text-slate-200 divide-slate-600" : "bg-white text-gray-800 divide-gray-200"}`}>
                    {planosData.filter(p => p.product_id === modalPlanos.id).map(plano => (
                      <tr key={plano.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{plano.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{plano.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">R$ {plano.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <button onClick={() => setModalEditPlano(plano)} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">
                            <FiEdit size={16} />
                          </button>
                          <button onClick={() => handleDeletePlano(plano.id)} className="text-red-600 hover:text-red-800">
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal Adicionar Plano */}
        <Modal open={modalAddPlano} onClose={() => setModalAddPlano(false)} title="Adicionar Plano">
          {modalPlanos && (
            <form className="space-y-4" onSubmit={handleAddPlano}>
              <input name="name" placeholder="Nome" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <input name="description" placeholder="Descrição" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <input name="price" type="number" step="0.01" placeholder="Preço" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <textarea name="benefits" placeholder="Benefícios (um por linha)" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} rows={4} />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
            </form>
          )}
        </Modal>

        {/* Modal Editar Plano */}
        <Modal open={!!modalEditPlano} onClose={() => setModalEditPlano(null)} title="Editar Plano">
          {modalEditPlano && (
            <form className="space-y-4" onSubmit={handleEditPlano}>
              <input name="name" defaultValue={modalEditPlano.name} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <input name="description" defaultValue={modalEditPlano.description} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <input name="price" type="number" step="0.01" defaultValue={modalEditPlano.price} className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} />
              <textarea name="benefits" defaultValue={modalEditPlano.benefits?.join("\n") || ""} placeholder="Benefícios (um por linha)" className={`w-full border rounded p-2 ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-gray-800"}`} rows={4} />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Atualizar</button>
            </form>
          )}
        </Modal>

      </main>
    </div>
  );
};

export default Produtos;
