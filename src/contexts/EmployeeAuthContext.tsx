
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

// Mock employee data for demo purposes when backend is not available
const mockEmployeeData: Employee = {
  idEmployee: 1,
  idCard: "EMP001",
  firstName: "Jean",
  lastName: "Dupont",
  email: "employee@example.com",
  phone: "0600000000",
  gender: "homme",
  birthDate: "1990-01-01",
  address: "123 Rue de Paris",
  nationality: "Française",
  cnssNumber: "12345678",
  salary: 2500,
  contractType: "CDI",
  status: "actif",
  role: "employee",
  isPresent: false
};

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
        // Pour des besoins de démonstration, on peut utiliser des données fictives
        if (token === 'demo-employee-token') {
          setEmployee(mockEmployeeData);
          console.log("Using mock employee data for demonstration");
        } else {
          localStorage.removeItem('employeeToken');
        }
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
      
      // Pour des besoins de démonstration, on autorise la connexion avec des identifiants spécifiques
      if (email === 'employee@example.com' && password === 'password') {
        localStorage.setItem('employeeToken', 'demo-employee-token');
        setEmployee(mockEmployeeData);
        toast.success('Connexion réussie (mode démo)');
        return;
      }
      
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
      // Convert employee.idEmployee to string if it's a number
      const employeeId = employee.idEmployee.toString();
      const response = await authService.checkInEmployee(employeeId);
      if (response.success) {
        setEmployee(response.data);
        toast.success('Pointage d\'entrée enregistré');
        return true;
      }
      toast.error(response.error || 'Échec du pointage d\'entrée');
      return false;
    } catch (error) {
      console.error('Check-in failed:', error);
      // Mode démo: simuler un pointage d'entrée réussi
      const updatedEmployee = { ...employee, isPresent: true };
      setEmployee(updatedEmployee);
      toast.success('Pointage d\'entrée enregistré (mode démo)');
      return true;
    }
  };

  const checkOut = async () => {
    if (!employee) return false;
    
    try {
      // Convert employee.idEmployee to string if it's a number
      const employeeId = employee.idEmployee.toString();
      const response = await authService.checkOutEmployee(employeeId);
      if (response.success) {
        setEmployee(response.data);
        toast.success('Pointage de sortie enregistré');
        return true;
      }
      toast.error(response.error || 'Échec du pointage de sortie');
      return false;
    } catch (error) {
      console.error('Check-out failed:', error);
      // Mode démo: simuler un pointage de sortie réussi
      const updatedEmployee = { ...employee, isPresent: false };
      setEmployee(updatedEmployee);
      toast.success('Pointage de sortie enregistré (mode démo)');
      return true;
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
