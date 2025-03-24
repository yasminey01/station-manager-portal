
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Truck } from 'lucide-react';
import { suppliers } from '@/services/mockDatabase';
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
import { Supplier } from '@/types';

const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier => {
    const searchText = searchTerm.toLowerCase();
    
    return (
      supplier.idFournisseur.toString().includes(searchText) ||
      supplier.nomFournisseur.toLowerCase().includes(searchText) ||
      supplier.typeFournisseur.toLowerCase().includes(searchText) ||
      supplier.contactFournisseur.toLowerCase().includes(searchText) ||
      supplier.telephoneFournisseur.includes(searchText) ||
      supplier.emailFournisseur.toLowerCase().includes(searchText)
    );
  });

  const getSupplierTypeBadge = (type: string) => {
    switch(type) {
      case 'Carburant': return 'default';
      case 'Lubrifiant': return 'secondary';
      case 'Accessoire': return 'outline';
      case 'Pièce': return 'destructive';
      case 'Gaz': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gestion des fournisseurs
          </p>
        </div>
        <Button asChild>
          <Link to="/suppliers/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau fournisseur
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Liste des fournisseurs
          </CardTitle>
          <CardDescription>
            Catalogue des fournisseurs et leurs contacts
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      Aucun fournisseur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier: Supplier) => (
                    <TableRow key={supplier.idFournisseur}>
                      <TableCell className="font-medium">{supplier.idFournisseur}</TableCell>
                      <TableCell>{supplier.nomFournisseur}</TableCell>
                      <TableCell>
                        <Badge variant={getSupplierTypeBadge(supplier.typeFournisseur)}>
                          {supplier.typeFournisseur}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.contactFournisseur}</TableCell>
                      <TableCell>{supplier.telephoneFournisseur}</TableCell>
                      <TableCell>{supplier.emailFournisseur}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/suppliers/${supplier.idFournisseur}`}>
                              <Search className="h-4 w-4" />
                              <span className="sr-only">Détails</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/suppliers/${supplier.idFournisseur}/edit`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              <span className="sr-only">Modifier</span>
                            </Link>
                          </Button>
                        </div>
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

export default SuppliersPage;
