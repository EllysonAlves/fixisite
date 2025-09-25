import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';
import { getOneTenant, getProducts, getPlans } from '../../services/api';

const PRESET_THEMES = [
	{
		name: 'Claro',
		colors: { primary: '#1976d2', secondary: '#ff9800' },
		darkMode: false,
	},
	{
		name: 'Escuro',
		colors: { primary: '#22223b', secondary: '#f2e9e4' },
		darkMode: true,
	},
	{
		name: 'Moderno',
		colors: { primary: '#00bcd4', secondary: '#ff4081' },
		darkMode: false,
	},
	{
		name: 'Clássico',
		colors: { primary: '#2d6a4f', secondary: '#f4a261' },
		darkMode: false,
	},
];

const Temas: React.FC = () => {
	const { darkMode, toggleDarkMode } = useTheme();
	const token = localStorage.getItem('token');
	const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
	const tenantId = user.tenant_id;
	const [tenant, setTenant] = useState<any>(null);
	const [selectedTheme, setSelectedTheme] = useState(PRESET_THEMES[0]);
	const [produtos, setProdutos] = useState<any[]>([]);
	const [planos, setPlanos] = useState<any[]>([]);

	useEffect(() => {
		async function fetchData() {
			if (!token || !tenantId) return;
			try {
				const [tenantRes, produtosRes, planosRes] = await Promise.all([
					getOneTenant(token, tenantId),
					getProducts(token),
					getPlans(token)
				]);
				setTenant(tenantRes);
				setProdutos(produtosRes);
				setPlanos(planosRes);
			} catch (error: any) {
				toast.error(error.message || 'Erro ao buscar dados');
			}
		}
		fetchData();
	}, [token, tenantId]);

	// Preview da landing page
	const previewStyle = {
		background: selectedTheme.darkMode ? '#22223b' : '#f8f9fa',
		color: selectedTheme.darkMode ? '#f2e9e4' : '#22223b',
		minHeight: '100vh',
		transition: 'background 0.3s, color 0.3s',
	};

		return (
			<div className={`flex flex-col md:flex-row h-screen ${selectedTheme.darkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-slate-900'}`}>
				<Sidebar />
				<main className="flex-1 overflow-auto p-4 sm:p-6">
					<h1 className="text-2xl font-bold mb-6">Temas & Preview</h1>
					<div className="mb-6 flex flex-wrap gap-4">
						{PRESET_THEMES.map((theme) => (
							<button
								key={theme.name}
								onClick={() => { setSelectedTheme(theme); if (theme.darkMode !== darkMode) toggleDarkMode(); }}
								className={`px-4 py-2 rounded shadow font-semibold border-2 flex items-center gap-2 transition-all duration-300 ${selectedTheme.name === theme.name ? 'border-indigo-600' : 'border-gray-300'} ${theme.darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800'}`}
								style={{ background: theme.colors.primary, color: theme.colors.secondary }}
							>
								{theme.name}
							</button>
						))}
					</div>

					{/* Preview da landing page do tenant */}
					<div className="rounded-xl shadow-lg p-0 mt-4 overflow-hidden" style={previewStyle}>
						{tenant ? (
							<div className="w-full">
								{/* Header/Landing Hero */}
								<div className="w-full flex flex-col items-center justify-center py-10 px-4" style={{ background: selectedTheme.colors.primary, color: selectedTheme.colors.secondary }}>
									{tenant.logo ? (
										<img src={tenant.logo.startsWith('http') ? tenant.logo : `https://ticonnecte.com.br/FixiSite-api/public/${tenant.logo}`} alt="Logo" className="w-32 h-32 object-contain rounded-full border-4 border-white mb-4 shadow-lg" />
									) : (
										<span className="italic text-gray-400">Sem logo</span>
									)}
									<h2 className="text-4xl font-bold mb-2">{tenant.name}</h2>
									<span className="text-lg opacity-80 mb-2">{tenant.domain}</span>
									<span className="text-sm opacity-70">CPF/CNPJ: {tenant.cpf_cnpj}</span>
								</div>

								{/* Produtos Section */}
								<div className="w-full py-10 px-4" style={{ background: selectedTheme.colors.secondary, color: selectedTheme.colors.primary }}>
									<h2 className="text-2xl font-bold mb-6 text-center">Produtos</h2>
									<div className="flex flex-wrap justify-center gap-6">
										{produtos.length > 0 ? produtos.map((produto, idx) => (
											<div key={produto.id} className="rounded-xl shadow-lg p-6 min-w-[180px] flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl" style={{ background: selectedTheme.colors.primary, color: selectedTheme.colors.secondary }}>
												<span className="text-2xl font-bold mb-2">{produto.name}</span>
												<span className="text-xs opacity-70">ID: {produto.id}</span>
											</div>
										)) : (
											<span className="italic text-gray-400">Nenhum produto cadastrado</span>
										)}
									</div>
								</div>

								{/* Planos Section */}
								<div className="w-full py-10 px-4" style={{ background: selectedTheme.colors.primary, color: selectedTheme.colors.secondary }}>
									<h2 className="text-2xl font-bold mb-6 text-center">Planos</h2>
									<div className="flex flex-wrap justify-center gap-6">
										{planos.length > 0 ? planos.map((plano, idx) => (
											<div key={plano.id} className="rounded-xl shadow-lg p-6 min-w-[200px] flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl" style={{ background: selectedTheme.colors.secondary, color: selectedTheme.colors.primary }}>
												<span className="text-xl font-bold mb-1">{plano.name}</span>
												<span className="text-sm mb-1">{plano.title}</span>
												<span className="text-lg font-bold">R$ {plano.price}</span>
											</div>
										)) : (
											<span className="italic text-gray-400">Nenhum plano cadastrado</span>
										)}
									</div>
								</div>

								{/* Benefícios Section (mock, pode integrar depois) */}
								<div className="w-full py-10 px-4" style={{ background: selectedTheme.colors.secondary, color: selectedTheme.colors.primary }}>
									<h2 className="text-2xl font-bold mb-6 text-center">Benefícios</h2>
									<ul className="list-disc pl-6 flex flex-col items-center gap-2">
										<li>Suporte 24h</li>
										<li>Instalação grátis</li>
										<li>Wi-Fi incluso</li>
									</ul>
								</div>

								{/* Call to Action */}
								<div className="w-full py-10 px-4 flex flex-col items-center justify-center" style={{ background: selectedTheme.colors.primary, color: selectedTheme.colors.secondary }}>
									<h2 className="text-2xl font-bold mb-4">Assine já e tenha a melhor internet!</h2>
									<button className="px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-600 hover:text-white" style={{ background: selectedTheme.colors.secondary, color: selectedTheme.colors.primary }}>
										Quero ser cliente
									</button>
								</div>
							</div>
						) : (
							<div className="text-red-600">Tenant não encontrado.</div>
						)}
					</div>
				</main>
			</div>
		);
};

export default Temas;
