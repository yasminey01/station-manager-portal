
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Stations from '@/pages/Stations';
import StationDetail from '@/pages/StationDetail';
import StationForm from '@/pages/StationForm';
import Employees from '@/pages/Employees';
import EmployeeDetail from '@/pages/EmployeeDetail';
import EmployeeForm from '@/pages/EmployeeForm';
import Schedules from '@/pages/Schedules';
import PumpsAndTanks from '@/pages/PumpsAndTanks';
import PumpForm from '@/pages/PumpForm';
import TankForm from '@/pages/TankForm';
import Sales from '@/pages/Sales';
import SaleForm from '@/pages/SaleForm';
import Products from '@/pages/Products';
import Suppliers from '@/pages/Suppliers';
import StockEntries from '@/pages/StockEntries';
import Reports from '@/pages/Reports';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stations" element={<Stations />} />
              <Route path="stations/:id" element={<StationDetail />} />
              <Route path="stations/new" element={<StationForm />} />
              <Route path="stations/:id/edit" element={<StationForm />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="employees/new" element={<EmployeeForm />} />
              <Route path="employees/:id/edit" element={<EmployeeForm />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="pumps-and-tanks" element={<PumpsAndTanks />} />
              <Route path="pumps/new" element={<PumpForm />} />
              <Route path="pumps/:id/edit" element={<PumpForm />} />
              <Route path="tanks/new" element={<TankForm />} />
              <Route path="tanks/:id/edit" element={<TankForm />} />
              
              {/* Nouvelles routes pour les ventes */}
              <Route path="sales" element={<Sales />} />
              <Route path="sales/new" element={<SaleForm />} />
              <Route path="sales/:id/edit" element={<SaleForm />} />
              
              {/* Nouvelles routes pour la gestion des stocks et fournisseurs */}
              <Route path="products" element={<Products />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="stock-entries" element={<StockEntries />} />
              
              {/* Nouvelle route pour les rapports */}
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
