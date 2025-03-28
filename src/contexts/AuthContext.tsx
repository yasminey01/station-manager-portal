
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Pour la démo, utilisation de données fictives
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Dans une application réelle, ce serait un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' && password === 'password') {
        const userData: User = {
          id: 1,
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          telephone: '+212 654 987 321',
          photoUrl: ''
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Connexion réussie');
      } 
      else if (email === 'manager@example.com' && password === 'password') {
        const userData: User = {
          id: 2,
          email: 'manager@example.com',
          firstName: 'Manager',
          lastName: 'User',
          role: 'manager',
          telephone: '+212 654 123 789',
          photoUrl: ''
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Connexion réussie');
      }
      else if (email === 'employee@example.com' && password === 'password') {
        const userData: User = {
          id: 3,
          email: 'employee@example.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'employee',
          telephone: '+212 654 456 789',
          photoUrl: ''
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Connexion réussie');
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
