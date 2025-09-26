
import axios from 'axios';
import type { StringFormatParams } from 'zod/v4/core';

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
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Remove token e redireciona
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
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
  tenant_id: string
}

interface benefits{
  id: string,
  plans_id: string,
  description: string,
  created_at: string,
  updated_at: string
}

interface Plans{
  id: string,
  name: string,
  title: string,
  price: string,
  product_id: string,
  created_at: string,
  updated_at: string,
  benefits: benefits[]
}

interface UpdateProductData {
  name: string;
  tenant_id: string;
}

export interface UpdatePlanData {
  tenant_id: string;
  name: string;
  description: string;
  price: number | string;
  product_id: string;
  benefits: string[];
}

interface Tenant{
  id: string,
  name: string,
  domain: string,
  logo: string,
  theme: string | {
    primary: string;
    secondary: string;
    [key: string]: string;
  },
  cpf_cnpj: string,
  created_at: string,
  updated_at: string
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

export const getPlans = async (token: string): Promise<Plans[]> => {
  try {
    const response = await api.get(
      'api/plan',
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
    console.error('Erro ao buscar planos:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar planos');
  }
};

export const addPlan = async (token: string, data: Record<string, any>) => {
  try {
    const response = await api.post("api/plan", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // Verifica se a resposta indica sucesso
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao adicionar plano');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao adicionar plano:', error);

    // Tratamento detalhado do erro
    let errorMessage = 'Erro ao adicionar plano';

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

export const updatePlan = async (token: string, id: string, data: UpdatePlanData) => {
  try {
    const response = await api.put(`api/plan/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // Verifica se a resposta indica erro
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao atualizar plano');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar plano:', error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Erro ao atualizar plano';

    throw new Error(errorMessage);
  }
};

export const deletePlan = async (token: string, id: string) => {
  try {
    const response = await api.delete(
      `api/plan/${id}`, // endpoint do produto
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    if (response.data.status === 'error') {
      const error = new Error(response.data.message || 'Erro ao deletar plano');
      (error as any).response = { data: response.data };
      throw error;
    }

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Plano deletado com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao deletar plano:', error);

    let errorMessage = 'Erro ao deletar plano';
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

export const getOneTenant = async (token: string, id: string): Promise<Tenant> => {
  try {
    const response = await api.get(
      `api/tenant/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Formato de dados inválido na resposta da API');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar Tenant:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar Tenant');
  }
};

export const getTenant = async (token: string): Promise<Tenant[]> => {
  try {
    const response = await api.get(
      'api/tenant',
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
    console.error('Erro ao buscar Tenants:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar Tenants');
  }
};

export const updateTenant = async (
  token: string,
  id: string,
  data: {
    name: string;
    domain: string;
    logo: File | null;
    cpf_cnpj: string;
    theme: string;
  }
) => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', data.name);
    formData.append('domain', data.domain);
    formData.append('cpf_cnpj', data.cpf_cnpj);
    formData.append('theme', data.theme);
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    const response = await api.post(`api/tenant/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao atualizar tenant');
    }
    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar tenant:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Erro ao atualizar tenant';
    throw new Error(errorMessage);
  }
};

export const addTenant = async (
  token: string,
  data: {
    id: string;
    name: string;
    domain: string;
    logo: File | null;
    cpf_cnpj: string;
    theme: string;
  }
) => {
  try {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('domain', data.domain);
    formData.append('cpf_cnpj', data.cpf_cnpj);
    formData.append('theme', data.theme);
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    const response = await api.post(`api/tenant/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Erro ao adicionar tenant');
    }
    return response.data;
  } catch (error: any) {
    console.error('Erro ao adicionar tenant:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Erro ao adicionar tenant';
    throw new Error(errorMessage);
  }
};

