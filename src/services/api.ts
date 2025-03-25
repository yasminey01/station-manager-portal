
import { User, Station, Employee, Sale, Product, Supplier, StockEntry, Pump, Tank, ApiResponse } from '@/types';

const API_URL = 'http://localhost:5000/api';

// Fonction générique pour les requêtes API
export default async function fetchApi<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    return result as ApiResponse<T>;
  } catch (error) {
    console.error('API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
}

// Services API pour les utilisateurs
export const userService = {
  getAll: () => fetchApi<User[]>('/users'),
  getById: (id: number) => fetchApi<User>(`/users/${id}`),
  create: (user: Partial<User>) => fetchApi<User>('/users', 'POST', user),
  update: (id: number, user: Partial<User>) => fetchApi<User>(`/users/${id}`, 'PUT', user),
  delete: (id: number) => fetchApi<void>(`/users/${id}`, 'DELETE'),
};

// Services API pour les stations
export const stationService = {
  getAll: () => fetchApi<Station[]>('/stations'),
  getById: (id: number) => fetchApi<Station>(`/stations/${id}`),
  create: (station: Partial<Station>) => fetchApi<Station>('/stations', 'POST', station),
  update: (id: number, station: Partial<Station>) => fetchApi<Station>(`/stations/${id}`, 'PUT', station),
  delete: (id: number) => fetchApi<void>(`/stations/${id}`, 'DELETE'),
};

// Services API pour les employés
export const employeeService = {
  getAll: () => fetchApi<Employee[]>('/employees'),
  getById: (id: number) => fetchApi<Employee>(`/employees/${id}`),
  create: (employee: Partial<Employee>) => fetchApi<Employee>('/employees', 'POST', employee),
  update: (id: number, employee: Partial<Employee>) => fetchApi<Employee>(`/employees/${id}`, 'PUT', employee),
  delete: (id: number) => fetchApi<void>(`/employees/${id}`, 'DELETE'),
};

// Services API pour les ventes
export const saleService = {
  getAll: () => fetchApi<Sale[]>('/sales'),
  getById: (id: number) => fetchApi<Sale>(`/sales/${id}`),
  create: (sale: Partial<Sale>) => fetchApi<Sale>('/sales', 'POST', sale),
  update: (id: number, sale: Partial<Sale>) => fetchApi<Sale>(`/sales/${id}`, 'PUT', sale),
  delete: (id: number) => fetchApi<void>(`/sales/${id}`, 'DELETE'),
};

// Services API pour les produits
export const productService = {
  getAll: () => fetchApi<Product[]>('/products'),
  getById: (id: number) => fetchApi<Product>(`/products/${id}`),
  create: (product: Partial<Product>) => fetchApi<Product>('/products', 'POST', product),
  update: (id: number, product: Partial<Product>) => fetchApi<Product>(`/products/${id}`, 'PUT', product),
  delete: (id: number) => fetchApi<void>(`/products/${id}`, 'DELETE'),
};

export {
  userService,
  stationService,
  employeeService,
  saleService,
  productService,
};
