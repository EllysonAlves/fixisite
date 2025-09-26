import { useEffect, useState } from "react";

type ProductOption = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  options?: ProductOption[];
};

type PlanBenefit = string | { description: string };
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  product_id: string;
  benefits: PlanBenefit[];
};

type CartItem = {
  productId: string;
  planId?: string;
  name: string;
  price: number;
  description: string;
};

type TenantTheme = {
  name?: string;
  primary: string;
  secondary: string;
};

const defaultThemes: TenantTheme[] = [
  { name: "Padrão", primary: "#1976d2", secondary: "#ff9800" },
  { name: "Dark", primary: "#22223b", secondary: "#4a4e69" },
  { name: "Green", primary: "#43a047", secondary: "#c8e6c9" },
];

const SiteTemplate = () => {
  const [tenant, setTenant] = useState<any>(null);
  const [theme, setTheme] = useState<TenantTheme>(defaultThemes[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});

  useEffect(() => {
    const preview = localStorage.getItem("tenant_preview");
    if (preview) {
      const tenantData = JSON.parse(preview);
      setTenant(tenantData);

      let themeObj: TenantTheme = defaultThemes[0];
      if (typeof tenantData.theme === "string") {
        try {
          themeObj = JSON.parse(tenantData.theme);
        } catch {}
      } else if (typeof tenantData.theme === "object") {
        themeObj = tenantData.theme;
      }
      setTheme(themeObj);
    }
  }, []);

  // Produtos e planos do tenant
  const products: Product[] = tenant?.products || [];
  const plans: Plan[] = tenant?.plans || [];

  // Temas do tenant (se houver)
  const tenantThemes: TenantTheme[] = tenant?.themes
    ? tenant.themes.map((t: any) => ({
        name: t.name,
        primary: t.primary,
        secondary: t.secondary,
      }))
    : [];

  const themeButtons: TenantTheme[] = [
    ...(tenantThemes.length ? tenantThemes : []),
    theme,
    ...defaultThemes,
  ];

  // Adiciona ao carrinho o plano selecionado
  const addToCart = (product: Product, plan: Plan) => {
    setCart((prev) => [
      ...prev,
      {
        productId: product.id,
        planId: plan.id,
        name: `${product.name} - ${plan.name}`,
        price: Number(plan.price),
        description: plan.description,
      },
    ]);
    setSelectedPlans((prev) => ({ ...prev, [product.id]: plan.id }));
  };

  // Remove plano do produto do carrinho
  const removeProductFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setSelectedPlans((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + Number(item.price), 0);

  const getDiscountPrice = () => {
    const total = getTotalPrice();
    if (cart.length >= 3) return total * 0.85;
    if (cart.length >= 2) return total * 0.9;
    return total;
  };

  const generateWhatsAppMessage = () => {
    const items = cart
      .map((item) => `• ${item.name} - R$ ${Number(item.price).toFixed(2)}`)
      .join("\n");
    const total = Number(getDiscountPrice() || 0).toFixed(2);
    const message = `Olá! Gostaria de contratar o seguinte combo ${tenant?.name || "Devotech"}:\n\n${items}\n\nTotal: R$ ${total}/mês\n\nPoderia me ajudar?`;
    return encodeURIComponent(message);
  };

  const WhatsAppButton = () => (
    <a
      href={`https://wa.me/5581989649188?text=${generateWhatsAppMessage()}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-green-500 rounded-full shadow-lg p-4 z-50 flex items-center justify-center hover:scale-110 transition-transform"
      title="Fale conosco no WhatsApp"
      style={{ boxShadow: "0 8px 32px rgba(34,197,94,0.3)" }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    </a>
  );

  // Card do produto com planos e benefícios
  const ProductCard = ({ product }: { product: Product }) => {
    const productPlans = plans.filter((plan) => plan.product_id === product.id);
    const selectedPlanId = selectedPlans[product.id];
    const selectedPlan = productPlans.find((p) => p.id === selectedPlanId);

    return (
      <div className="combo-card bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition duration-300 hover:scale-[1.03] hover:shadow-2xl animate-fade-in flex flex-col">
        <div
          className="p-6 flex flex-col justify-between"
          style={{
            background: theme.primary,
            color: theme.secondary,
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
            minHeight: "140px", // altura fixa para todos os cards
            maxHeight: "140px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 className="text-2xl font-extrabold mb-2">{product.name}</h3>
          <p className="opacity-90 mb-2">
            {product.description && product.description.trim() !== ""
              ? product.description
              : <span style={{ opacity: 0 }}>&nbsp;</span>}
          </p>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          {productPlans.length > 0 ? (
            <>
              <label className="block text-gray-700 mb-2 font-semibold">Planos:</label>
              <div className="flex flex-col gap-2 mb-4">
                {productPlans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition ${
                      selectedPlanId === plan.id
                        ? "border-2"
                        : "border"
                    }`}
                    style={{
                      borderColor: selectedPlanId === plan.id ? theme.primary : "#e5e7eb",
                      background: selectedPlanId === plan.id ? theme.secondary : "#fff",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlanId === plan.id}
                      onChange={() => {
                        if (selectedPlanId === plan.id) {
                          removeProductFromCart(product.id);
                        } else {
                          addToCart(product, plan);
                        }
                      }}
                      className="form-checkbox h-5 w-5"
                      style={{
                        accentColor: theme.primary,
                      }}
                    />
                    <span className="font-semibold">{plan.name}</span>
                    <span className="ml-2 text-sm font-bold" style={{ color: theme.primary }}>R$ {Number(plan.price).toFixed(2)}</span>
                  </label>
                ))}
              </div>
              {selectedPlan && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">Benefícios:</label>
                  <ul className="list-disc pl-4 text-gray-700">
                    {selectedPlan.benefits.map((b: PlanBenefit, i: number) => (
                      <li key={i}>{typeof b === "string" ? b : b.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 mb-4">Nenhum plano cadastrado para este produto.</p>
          )}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.category && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: theme.secondary,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}`,
                }}
              >
                {product.category.toUpperCase()}
              </span>
            )}
          </div>
          <a
            href={`/dashboard/site-preview/produto/${product.id}`}
            className="block mt-3 font-semibold text-center rounded-lg px-4 py-2 transition"
            style={{
              background: theme.primary,
              color: theme.secondary,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver detalhes
          </a>
        </div>
      </div>
    );
  };

  const duvidasLinks = [
    {
      title: "Verifique sua viabilidade",
      description: "Descubra se podemos atender você em sua área.",
      url: "https://wa.me/5581996744046?text=Quero%20verificar%20minha%20viabilidade%20de%20instala%C3%A7%C3%A3o",
      icon: "🗺️",
      button: "Clique aqui!"
    },
    {
      title: "Teste de velocidade!",
      description: "Verifique a velocidade da sua internet!",
      url: "https://ticonnect.speedtestcustom.com/",
      icon: "⚡",
      button: "Clique aqui!"
    },
    {
      title: "Falar com um atendente",
      description: "Equipe de profissionais capacitados e uma central do assinante eficiente. Suporte rápido, em até 24h.",
      url: "https://wa.me/5581996744046?text=Quero%20falar%20com%20um%20atendente",
      icon: "💬",
      button: "Clique aqui!"
    },
    {
      title: "Ampliar o sinal do seu WIFI",
      description: "Equipe de profissionais capacitados e uma central do assinante eficiente. Suporte rápido, em até 24h.",
      url: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODcwMjIxMDE4NTI4OTk3?story_media_id=3037416974704562898&igsh=MTJkMGhtNTQyZ3Fobw==",
      icon: "📶",
      button: "Clique aqui!"
    },
    {
      title: "Atualize seu plano",
      description: "Descubra as opções de atualização de plano que oferecemos para atender melhor às suas necessidades de conexão.",
      url: "https://wa.me/5581996744046?text=Quero%20atualizar%20meu%20plano",
      icon: "🔄",
      button: "Clique aqui!"
    },
    {
      title: "Pagar fatura com cartão de crédito",
      description: "Equipe de profissionais capacitados e uma central do assinante eficiente. Suporte rápido, em até 24h.",
      url: "https://www.instagram.com/tv/B8b5GEEFszD/?igsh=OHBrYWJxb21uZDg%3D",
      icon: "💳",
      button: "Clique aqui!"
    },
    {
      title: "Assinar contrato via aplicativo",
      description: "Equipe de profissionais capacitados e uma central do assinante eficiente. Suporte rápido, em até 24h.",
      url: "https://www.instagram.com/tv/B8b4drIl0AV/?igsh=eWRxYXQ4ZGttMmFn",
      icon: "📱",
      button: "Clique aqui!"
    },
  ];

  function removeFromCart(idx: number): void {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="bg-gray-50 min-h-screen" style={{ background: theme.secondary }}>
      {/* Theme Switcher */}
      <div className="flex flex-wrap gap-2 p-4 justify-end animate-slide-up">
        <span className="font-bold">Tema:</span>
        {themeButtons.map((t, idx) => (
          <button
            key={t.name || idx}
            onClick={() => setTheme({ primary: t.primary, secondary: t.secondary })}
            style={{
              background: t.primary,
              color: t.secondary,
              border: theme.primary === t.primary && theme.secondary === t.secondary ? "2px solid #fff" : "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "transform 0.2s",
            }}
            className={`px-4 py-2 rounded font-semibold hover:scale-105`}
          >
            {t.name || "Meu Tema"}
          </button>
        ))}
      </div>
      {/* Navigation */}
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
            <a href="#planos" className="hover:underline transition">Planos</a>
            <a href="#produtos" className="hover:underline transition">Produtos</a>
            <a href="#combo" className="hover:underline transition">Meu Combo</a>
            <a href="#contato" className="hover:underline transition">Contato</a>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-white text-gray-900 py-12 animate-fade-in border-b border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">{tenant?.domain ? `Internet para ${tenant.domain}` : "Internet Rápida e Estável"}</h1>
          <p className="text-xl md:text-2xl mb-8">Monte seu combo personalizado e aproveite os melhores benefícios</p>
          <a href="#planos" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 inline-flex items-center shadow-lg">
            Ver Planos
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>
      {/* Products Section */}
      <section id="produtos" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primary }}>Nossos Produtos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3">Nenhum produto cadastrado.</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      {/* Combo Section */}
      <section id="combo" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primary }}>Seu Combo</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum produto selecionado.</p>
          ) : (
            <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow-lg p-6 animate-slide-up">
              <ul className="mb-6">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center py-2 border-b">
                    <span>{item.name}</span>
                    <span className="font-bold">R$ {Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right mb-2">
                <span className="font-bold">
                  Total: R$ {Number(getTotalPrice() || 0).toFixed(2)}
                </span>
              </div>
              {cart.length >= 2 && (
                <div className="text-right mb-2 text-green-600 font-bold">
                  Desconto aplicado: {cart.length === 2 ? "10%" : "15%"}
                </div>
              )}
              <div className="text-right mb-4">
                <span className="font-bold text-lg">
                  Total com desconto: R$ {Number(getDiscountPrice() || 0).toFixed(2)}
                </span>
              </div>
              <button
                className="w-full font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                style={{
                  background: theme.primary,
                  color: theme.secondary,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  marginBottom: "1rem",
                }}
                onClick={() => window.open(`https://wa.me/5581989649188?text=${generateWhatsAppMessage()}`, "_blank")}
              >
                Finalizar Compra
              </button>
              <WhatsAppButton />
            </div>
          )}
        </div>
      </section>
      {/* Section de dúvidas */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>SOLUÇÃO</h2>
            <h3 className="text-2xl font-semibold mb-4">ESTÁ COM ALGUMA DÚVIDA?</h3>
            <p className="text-gray-700 text-lg">Confira abaixo as principais informações que podem ajudar a encontrar o que precisa.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {duvidasLinks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-xl p-6 flex flex-row items-center min-w-[340px] max-w-[500px] w-full hover:shadow-2xl transition animate-fade-in"
                style={{
                  borderTop: `8px solid ${theme.primary}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}
              >
                <span className="text-4xl mr-6">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-xl mb-1" style={{ color: theme.primary }}>{item.title}</h4>
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold px-4 py-2 rounded transition"
                    style={{
                      background: theme.primary,
                      color: theme.secondary,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    }}
                  >
                    {item.button}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12" style={{ background: theme.primary, color: theme.secondary }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{tenant?.name || "NetFusion"}</h3>
              {tenant?.logo && (
                <img
                  src={
                    tenant.logo.startsWith("http")
                      ? tenant.logo
                      : `https://ticonnecte.com.br/FixiSite-api/public/${tenant.logo}`
                  }
                  alt="Logo"
                  className="w-16 h-16 object-contain rounded bg-white border mb-2 shadow-md"
                />
              )}
              <p className="text-blue-300">A melhor conexão para sua casa ou empresa.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Contato</h4>
              <p className="mb-1">WhatsApp: <a href="https://wa.me/5581996744046" target="_blank" rel="noopener noreferrer" className="underline">5581 99674-4046</a></p>
              <p className="mb-1">E-mail: contato@provedorexemplo.com</p>
              <p className="mb-1">Endereço: Rua Exemplo, 123, Centro, Cidade/UF</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Links úteis</h4>
              <ul>
                <li><a href="https://ticonnect.speedtestcustom.com/" target="_blank" rel="noopener noreferrer" className="underline">Teste de Velocidade</a></li>
                <li><a href="#planos" className="underline">Planos</a></li>
                <li><a href="#produtos" className="underline">Produtos</a></li>
                <li><a href="#combo" className="underline">Meu Combo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Horário de atendimento</h4>
              <p>Segunda a Sexta: 08h às 18h</p>
              <p>Sábado: 08h às 12h</p>
              <p>Domingos e feriados: fechado</p>
            </div>
          </div>
          <div
            className="mt-12 pt-8 text-center"
            style={{
              borderTop: `2px solid ${theme.secondary}`,
              color: theme.secondary,
            }}
          >
            <p>&copy; 2024 {tenant?.name || "NetFusion"}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      {/* Efeitos CSS */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-slide-up { animation: slideUp 0.5s; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default SiteTemplate;
