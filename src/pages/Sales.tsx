
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, Download } from 'lucide-react';
import { sales, getPumpById, getEmployeeById } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sale } from '@/types';

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSales = sales.filter(sale => {
    const searchText = searchTerm.toLowerCase();
    const pumpData = sale.idPompe ? getPumpById(sale.idPompe) : null;
    const employeeData = sale.idEmployee ? getEmployeeById(sale.idEmployee) : null;
    
    return (
      sale.idVente.toString().includes(searchText) ||
      (pumpData?.nomPompe || '').toLowerCase().includes(searchText) ||
      (employeeData?.firstName + ' ' + employeeData?.lastName).toLowerCase().includes(searchText) ||
      sale.quantiteVente.toString().includes(searchText) ||
      sale.modePaiement.toLowerCase().includes(searchText) ||
      format(new Date(sale.dateVente), 'dd/MM/yyyy HH:mm').includes(searchText)
    );
  });

  const getPaymentBadgeVariant = (paymentMode: string) => {
    switch(paymentMode) {
      case 'Espèces': return 'default';
      case 'Carte': return 'outline';
      case 'Virement': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
          <p className="text-muted-foreground">
            Gestion des ventes de carburant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/reports">
              <Download className="mr-2 h-4 w-4" />
              Rapports
            </Link>
          </Button>
          <Button asChild>
            <Link to="/sales/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle vente
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des ventes</CardTitle>
          <CardDescription>
            Historique des ventes enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Pompe</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead className="text-right">Quantité (L)</TableHead>
                  <TableHead className="text-right">Montant (DH)</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      Aucune vente trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale: Sale) => {
                    const pumpData = sale.idPompe ? getPumpById(sale.idPompe) : null;
                    const employeeData = sale.idEmployee ? getEmployeeById(sale.idEmployee) : null;
                    
                    return (
                      <TableRow key={sale.idVente}>
                        <TableCell className="font-medium">{sale.idVente}</TableCell>
                        <TableCell>
                          {format(new Date(sale.dateVente), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell>{pumpData?.nomPompe || 'N/A'}</TableCell>
                        <TableCell>
                          {employeeData 
                            ? `${employeeData.firstName} ${employeeData.lastName}` 
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{sale.quantiteVente.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{sale.montant?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getPaymentBadgeVariant(sale.modePaiement)}>
                            {sale.modePaiement}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/sales/${sale.idVente}`}>
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Détails</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/sales/${sale.idVente}/edit`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                <span className="sr-only">Modifier</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
