import { useParams } from 'react-router-dom';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const tenant = JSON.parse(localStorage.getItem('tenant_preview') || '{}');
  const produto = tenant.products?.find((p: any) => p.id === id);
  const theme = typeof tenant.theme === "object" ? tenant.theme : { primary: "#1976d2", secondary: "#ff9800" };
  const planos = tenant.plans?.filter((plan: any) => plan.product_id === id) || [];

  if (!produto) return (
    <div className="p-8 text-center text-red-500 font-bold">
      Produto não encontrado
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ background: theme.secondary }}>
      {/* Navbar */}
      <nav className="shadow-lg sticky top-0 z-40" style={{ background: theme.primary, color: theme.secondary }}>
        <div className="container mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            {tenant?.logo && (
              <img
                src={
                  tenant.logo.startsWith("http")
                    ? tenant.logo
                    : `https://ticonnecte.com.br/FixiSite-api/public/${tenant.logo}`
                }
                alt="Logo"
                className="w-10 h-10 object-contain rounded bg-white border shadow-md"
              />
            )}
            <span className="font-bold text-xl" style={{ color: theme.secondary }}>
              {tenant?.name || "NetFusion"}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <a href="/dashboard/site-preview#planos" className="hover:underline transition">Planos</a>
            <a href="/dashboard/site-preview#produtos" className="hover:underline transition">Produtos</a>
            <a href="/dashboard/site-preview#combo" className="hover:underline transition">Meu Combo</a>
            <a href="/dashboard/site-preview#contato" className="hover:underline transition">Contato</a>
          </div>
        </div>
      </nav>
      {/* Banner do produto */}
      <section
        className="w-full py-16 px-6 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: theme.primary,
          color: theme.secondary,
          borderBottom: "4px solid #eee"
        }}
      >
        {/* Sombra decorativa */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.12) 0, transparent 80%)" }} />
        <div className="max-w-3xl w-full text-center relative z-10 flex flex-col items-center">
          {/* Foto do produto */}
          {produto.photo && (
            <img
              src={produto.photo.startsWith("http")
                ? produto.photo
                : `https://ticonnecte.com.br/FixiSite-api/public/${produto.photo}`}
              alt={produto.name}
              className="w-40 h-40 object-cover rounded-xl shadow-lg mb-6 border-4 border-white"
            />
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight animate-fade-in">{produto.name}</h1>
          <p className="text-xl md:text-2xl mb-6 font-medium animate-fade-in">{produto.description}</p>
        </div>
      </section>

      {/* Detalhes e especificações */}
      <section className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl p-10 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>Especificações</h2>
            <ul className="mb-6 list-disc pl-6 text-gray-700 text-lg">
              {produto.options?.length ? (
                produto.options.map((opt: any) => (
                  <li key={opt.id} className="mb-2">
                    <span className="font-semibold">{opt.name}:</span> {opt.description} — <span className="font-bold">R$ {Number(opt.price).toFixed(2)}</span>
                  </li>
                ))
              ) : (
                <li>Sem opções adicionais cadastradas.</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>Planos disponíveis</h2>
            {planos.length === 0 ? (
              <p className="text-gray-500 mb-4">Nenhum plano cadastrado para este produto.</p>
            ) : (
              <div className="space-y-6">
                {planos.map((plan: any) => (
                  <div key={plan.id} className="border rounded-xl shadow p-6 hover:shadow-xl transition bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold" style={{ color: theme.primary }}>{plan.name}</h3>
                      <span className="block font-bold text-lg "style={{ color: theme.primary }}>R$ {Number(plan.price).toFixed(2)}/mês</span>
                    </div>
                    <p className="mb-2 text-gray-700">{plan.description}</p>
                    <div>
                      <span className="font-semibold">Benefícios:</span>
                      <ul className="list-disc pl-5 mt-2 text-gray-700">
                        {plan.benefits?.map((b: any, i: number) => (
                          <li key={i} className="mb-1">{typeof b === "string" ? b : b.description}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto mt-10 mb-10 text-center animate-slide-up">
        <div className=" rounded-xl py-8 px-6 shadow-lg flex flex-col items-center"style={{ backgroundColor: theme.primary }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Gostou deste produto?</h2>
          <p className="text-white mb-6 text-lg">Entre em contato agora mesmo e monte seu combo personalizado com os melhores planos e benefícios!</p>
          <a
            href={`https://wa.me/551140028922?text=Olá! Tenho interesse no produto ${produto.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white  font-bold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition text-xl"
            style={{ color: theme.primary }}
          >
            Fale com um especialista
          </a>
        </div>
      </section>

      {/* Efeito de animação */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-slide-up { animation: slideUp 0.5s; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default ProdutoDetalhe;