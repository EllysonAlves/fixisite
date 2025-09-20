export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Página Inicial
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Bem-vindo! Faça login para acessar o Dashboard.
      </p>
      <a
        href="/login"
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Ir para Login
      </a>
    </div>
  );
}
