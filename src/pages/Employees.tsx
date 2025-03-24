
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { employees } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  XCircle, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Employee } from '@/types';
import { toast } from 'sonner';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeList, setEmployeeList] = useState(employees);

  // Filter employees based on search term
  const filteredEmployees = employeeList.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.idCard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update employee status
  const toggleStatus = (id: number, newStatus: string) => {
    setEmployeeList(prev => 
      prev.map(employee => 
        employee.idEmployee === id 
          ? { ...employee, status: newStatus } 
          : employee
      )
    );
    
    toast.success(`Le statut de l'employé a été mis à jour avec succès.`);
  };

  // Delete employee
  const deleteEmployee = (id: number) => {
    setEmployeeList(prev => prev.filter(employee => employee.idEmployee !== id));
    toast.success('L\'employé a été supprimé avec succès.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos employés et leurs affectations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/schedules">
              <Calendar className="h-4 w-4 mr-2" />
              Planification
            </Link>
          </Button>
          <Button className="shrink-0" asChild>
            <Link to="/employees/new">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des employés</CardTitle>
          <CardDescription>
            {filteredEmployees.length} {filteredEmployees.length > 1 ? 'employés trouvés' : 'employé trouvé'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, CIN..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom & Prénom</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Contrat</TableHead>
                  <TableHead>Salaire (DH)</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.idEmployee}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.idCard}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.contractType}</TableCell>
                      <TableCell>{employee.salary.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                          {employee.status === 'actif' ? (
                            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3 text-red-500" />
                          )}
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to={`/employees/${employee.idEmployee}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/employees/${employee.idEmployee}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(
                                employee.idEmployee, 
                                employee.status === 'actif' ? 'inactif' : 'actif'
                              )}
                            >
                              {employee.status === 'actif' ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteEmployee(employee.idEmployee)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
