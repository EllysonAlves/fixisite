

import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../../components/Modal';
import Sidebar from '../../components/Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { updateTenant, getOneTenant } from '../../services/api';


interface Tenant {
  id: string;
  name: string;
  domain: string;
  logo: string;
  cpf_cnpj: string;
  theme: string | {
    primary: string;
    secondary: string;
    [key: string]: string;
  };
}


const ConfiguracaoTenant: React.FC = () => {
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  const tenantId = user.tenant_id;
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [modalEdit, setModalEdit] = useState(false);
  const [themeColors, setThemeColors] = useState({ primary: '#1976d2', secondary: '#ff9800' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Buscar dados reais do tenant pelo tenantId
    // Exemplo:
    // async function fetchTenant() {
    //   const res = await getTenant(token, tenantId);
    //   setTenant(res);
    //   setThemeColors(res.theme);
    // }
    // fetchTenant();
    // Simulação:
    async function fetchTenant() {
      if (!token || !tenantId) return;
      
      try {
        const res = await getOneTenant(token, tenantId);
        if (res && res.id) {
          setTenant(res);
          let themeObj = { primary: '#1976d2', secondary: '#ff9800' };
          if (typeof res.theme === 'string') {
            try {
              themeObj = JSON.parse(res.theme);
            } catch {}
          } else if (typeof res.theme === 'object') {
            themeObj = res.theme as any;
          }
          setThemeColors(themeObj);
        }
      } catch (error: any) {
        toast.error(error.message || 'Erro ao buscar tenant');
      }
    }
    fetchTenant();
  }, [token, tenantId]);

  const handleEditTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !tenant) return toast.error('Tenant inválido');
    setLoading(true);
    setSuccess(false);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const domain = (form.elements.namedItem('domain') as HTMLInputElement).value;
    const cpf_cnpj = (form.elements.namedItem('cpf_cnpj') as HTMLInputElement).value;
    const logoInput = form.elements.namedItem('logo') as HTMLInputElement;
    const logo = logoInput.files && logoInput.files[0] ? logoInput.files[0] : null;
    const theme = themeColors;
    if (!name || !domain || !cpf_cnpj) {
      setLoading(false);
      return toast.error('Preencha todos os campos');
    }
    try {
      const res = await updateTenant(token, tenant.id, { name, domain, logo, cpf_cnpj, theme: JSON.stringify(theme) });
      setTenant(res);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalEdit(false);
      }, 1200);
      toast.success('Tenant atualizado com sucesso');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao atualizar tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-slate-900'}`}>
      <Toaster position="top-right" />
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Configuração do Tenant</h1>
        <div className="mb-6">
          {tenant ? (
            <div className={`rounded-xl shadow-lg p-6 flex flex-col gap-4 animate-fade-in ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}
              style={{ transition: 'box-shadow 0.3s, background 0.3s' }}>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="mb-2"><span className="font-semibold">Nome:</span> {tenant.name}</div>
                  <div className="mb-2"><span className="font-semibold">Domain:</span> {tenant.domain}</div>
                  <div className="mb-2"><span className="font-semibold">CPF/CNPJ:</span> {tenant.cpf_cnpj}</div>
                  <div className="mb-2 flex gap-2 items-center">
                    <span className="font-semibold">Theme:</span>
                    <span className="px-3 py-1 rounded transition-all duration-300" style={{ background: themeColors.primary, color: themeColors.secondary }}>Primary</span>
                    <span className="px-3 py-1 rounded transition-all duration-300" style={{ background: themeColors.secondary, color: themeColors.primary }}>Secondary</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold mb-1">Logo:</span>
                  {tenant.logo ? (
                    <img src={tenant.logo.startsWith('http') ? tenant.logo : `https://ticonnecte.com.br/FixiSite-api/public/${tenant.logo}`} alt="Logo" className="w-24 h-24 object-contain rounded border transition-all duration-300" />
                  ) : (
                    <span className="italic text-gray-400">Não enviado</span>
                  )}
                </div>
              </div>
              <button onClick={() => setModalEdit(true)} className={`mt-2 px-6 py-2 rounded font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${darkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>Editar Tenant</button>
            </div>
          ) : (
            <div className="text-red-600 animate-fade-in">Tenant não encontrado.</div>
          )}
        </div>

        {/* Modal Editar Tenant */}
        <Modal open={modalEdit} onClose={() => setModalEdit(false)} title="Editar Tenant">
          {tenant && (
            <form className="space-y-4 animate-slide-up" onSubmit={handleEditTenant} encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-semibold" htmlFor="name">Nome</label>
                <input name="name" defaultValue={tenant.name} className={`w-full border rounded p-2 transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-white text-gray-800 border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1 font-semibold" htmlFor="domain">Domain</label>
                <input name="domain" defaultValue={tenant.domain} className={`w-full border rounded p-2 transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-white text-gray-800 border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1 font-semibold" htmlFor="cpf_cnpj">CPF/CNPJ</label>
                <input name="cpf_cnpj" defaultValue={tenant.cpf_cnpj} className={`w-full border rounded p-2 transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-white text-gray-800 border-gray-300'}`} />
              </div>
              <div className="flex gap-4 items-center">
                <div>
                  <label htmlFor="primary" className="font-semibold">Cor Primária:</label>
                  <input
                    type="color"
                    id="primary"
                    name="primary"
                    value={themeColors.primary}
                    onChange={e => setThemeColors({ ...themeColors, primary: e.target.value })}
                    className="ml-2 w-8 h-8 border-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="secondary" className="font-semibold">Cor Secundária:</label>
                  <input
                    type="color"
                    id="secondary"
                    name="secondary"
                    value={themeColors.secondary}
                    onChange={e => setThemeColors({ ...themeColors, secondary: e.target.value })}
                    className="ml-2 w-8 h-8 border-none transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold" htmlFor="logo">Logo</label>
                <input name="logo" type="file" accept="image/*" className={`w-full border rounded p-2 transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-white text-gray-800 border-gray-300'}`} />
              </div>
              <button type="submit" disabled={loading} className={`w-full py-2 rounded font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''} ${darkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                {loading ? <FiLoader className="animate-spin" /> : success ? <FiCheckCircle className="text-green-400" /> : null}
                {success ? 'Salvo!' : loading ? 'Salvando...' : 'Atualizar'}
              </button>
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
};

// Animations CSS
const style = document.createElement('style');
style.innerHTML = `
  .animate-fade-in { animation: fadeIn 0.5s; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  .animate-slide-up { animation: slideUp 0.4s; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
`;
if (!document.head.querySelector('style[data-tenant-anim]')) {
  style.setAttribute('data-tenant-anim', 'true');
  document.head.appendChild(style);
}

export default ConfiguracaoTenant;
