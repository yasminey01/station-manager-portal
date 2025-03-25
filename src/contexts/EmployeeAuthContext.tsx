
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

interface EmployeeAuthContextProps {
  employee: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkIn: () => Promise<boolean>;
  checkOut: () => Promise<boolean>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextProps>({
  employee: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  checkIn: async () => false,
  checkOut: async () => false,
});

export const EmployeeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.validateEmployeeToken(token);
        if (response.success && response.data.employee) {
          setEmployee(response.data.employee);
        } else {
          localStorage.removeItem('employeeToken');
        }
      } catch (error) {
        console.error('Authentication validation failed:', error);
        localStorage.removeItem('employeeToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.loginEmployee(email, password);
      if (response.success && response.data.token && response.data.employee) {
        localStorage.setItem('employeeToken', response.data.token);
        setEmployee(response.data.employee);
        toast.success('Connexion réussie');
        return;
      }
      throw new Error(response.error || 'Erreur de connexion');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('employeeToken');
    setEmployee(null);
    toast.success('Déconnexion réussie');
  };

  const checkIn = async () => {
    if (!employee) return false;
    
    try {
      const response = await authService.checkInEmployee(employee.id);
      if (response.success) {
        setEmployee(response.data);
        toast.success('Pointage d\'entrée enregistré');
        return true;
      }
      toast.error(response.error || 'Échec du pointage d\'entrée');
      return false;
    } catch (error) {
      console.error('Check-in failed:', error);
      toast.error('Échec du pointage d\'entrée');
      return false;
    }
  };

  const checkOut = async () => {
    if (!employee) return false;
    
    try {
      const response = await authService.checkOutEmployee(employee.id);
      if (response.success) {
        setEmployee(response.data);
        toast.success('Pointage de sortie enregistré');
        return true;
      }
      toast.error(response.error || 'Échec du pointage de sortie');
      return false;
    } catch (error) {
      console.error('Check-out failed:', error);
      toast.error('Échec du pointage de sortie');
      return false;
    }
  };

  return (
    <EmployeeAuthContext.Provider
      value={{
        employee,
        isAuthenticated: !!employee,
        isLoading,
        login,
        logout,
        checkIn,
        checkOut,
      }}
    >
      {children}
    </EmployeeAuthContext.Provider>
  );
};

export const useEmployeeAuth = () => useContext(EmployeeAuthContext);
