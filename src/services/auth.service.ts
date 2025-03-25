
import { ApiResponse, Employee, User } from '@/types';
import { fetchApi } from './api';

export const authService = {
  loginEmployee: (email: string, password: string) => 
    fetchApi<{ employee: Employee; token: string }>('/auth/employee/login', 'POST', { email, password }),
  
  registerEmployee: (employeeData: Partial<Employee>) => 
    fetchApi<{ employee: Employee; token: string }>('/auth/employee/register', 'POST', employeeData),
  
  validateEmployeeToken: (token: string) => 
    fetchApi<{ employee: Employee }>('/auth/employee/validate', 'POST', { token }),
  
  checkInEmployee: (employeeId: number) => 
    fetchApi<Employee>(`/employees/${employeeId}/check-in`, 'POST'),
  
  checkOutEmployee: (employeeId: number) => 
    fetchApi<Employee>(`/employees/${employeeId}/check-out`, 'POST'),
  
  getEmployeeAttendance: (employeeId: number, startDate?: string, endDate?: string) => {
    let endpoint = `/attendance/${employeeId}`;
    if (startDate && endDate) {
      endpoint += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return fetchApi<any[]>(endpoint);
  }
};

export default authService;
