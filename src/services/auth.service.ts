
import { ApiResponse, Employee, User } from '@/types';
import fetchApi from './api';

export const authService = {
  loginEmployee: (email: string, password: string) => 
    fetchApi<{ employee: Employee; token: string }>('/auth/employee/login', 'POST', { email, password }),
  
  registerEmployee: (employeeData: Partial<Employee>) => 
    fetchApi<{ employee: Employee; token: string }>('/auth/employee/register', 'POST', employeeData),
  
  validateEmployeeToken: (token: string) => 
    fetchApi<{ employee: Employee }>('/auth/employee/validate', 'POST', { token }),
  
  checkInEmployee: (employeeId: string) => 
    fetchApi<Employee>(`/auth/employees/${employeeId}/check-in`, 'POST'),
  
  checkOutEmployee: (employeeId: string) => 
    fetchApi<Employee>(`/auth/employees/${employeeId}/check-out`, 'POST'),
  
  getEmployeeAttendance: (employeeId: string, startDate?: string, endDate?: string) => {
    let endpoint = `/auth/attendance/${employeeId}`;
    if (startDate && endDate) {
      endpoint += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return fetchApi<any[]>(endpoint);
  }
};

export default authService;
