import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ticonnecte.com.br/FixiSite-api/public/',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Lógica para token expirado
    }
    return Promise.reject(error);
  }
);

export default api;

interface Products {
  id: string,
  name: string,
  created_at: string,
  updated_at: string,
  enterprise_id: string
}

interface UpdateProductData {
  name: string;
  enterprise_id: string;
}


export const getProducts = async (token: string): Promise<Products[]> => {
  try {
    const response = await api.get(
      'api/product',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Formato de dados inválido na resposta da API');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar colaboradores');
  }
};

export const addProduct = async (token: string, data: Record<string, any>) => {
  try {
    const response = await api.post("api/product/", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // Verifica se a resposta indica sucesso
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao adicionar produto');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao adicionar produto:', error);

    // Tratamento detalhado do erro
    let errorMessage = 'Erro ao adicionar produto';

    if (error.response) {
      // Erro vindo do servidor
      errorMessage = error.response.data?.message ||
        error.response.data?.error ||
        `Erro ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      errorMessage = 'Sem resposta do servidor';
    } else {
      // Outros erros
      errorMessage = error.message || error;
    }

    throw new Error(errorMessage);
  }
};

export const updateProduct = async (token: string, id: string, data: UpdateProductData) => {
  try {
    const response = await api.put(`api/product/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // Verifica se a resposta indica erro
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao atualizar produto');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Erro ao atualizar produto';

    throw new Error(errorMessage);
  }
};

export const deleteProduct = async (token: string, produto: { id: string; name: string; enterprise_id: string }) => {
  try {
    const response = await api.delete(
      `api/product/${produto.id}`, // endpoint do produto
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        data: { name: produto.name, enterprise_id: produto.enterprise_id }, // envia raw JSON
      }
    );

    if (response.data.status === 'error') {
      const error = new Error(response.data.message || 'Erro ao deletar produto');
      (error as any).response = { data: response.data };
      throw error;
    }

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Produto deletado com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);

    let errorMessage = 'Erro ao deletar produto';
    let errorDetails = null;

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      errorDetails = error.response.data?.details || error.response.data;
    } else if (error.request) {
      errorMessage = 'Sem resposta do servidor';
    } else {
      errorMessage = error.message || error;
    }

    const err = new Error(errorMessage);
    (err as any).success = false;
    (err as any).details = errorDetails;
    (err as any).status = error.response?.status;
    (err as any).code = error.response?.data?.code;
    throw err;
  }
};

