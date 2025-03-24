
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, Package } from 'lucide-react';
import { stockEntries, getProductById, getSupplierById } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { StockEntry } from '@/types';

const StockEntriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEntries = stockEntries.filter(entry => {
    const searchText = searchTerm.toLowerCase();
    const product = entry.idProduct ? getProductById(entry.idProduct) : null;
    const supplier = entry.idFournisseur ? getSupplierById(entry.idFournisseur) : null;
    
    return (
      entry.idEntree.toString().includes(searchText) ||
      (product?.nomProduit || '').toLowerCase().includes(searchText) ||
      (supplier?.nomFournisseur || '').toLowerCase().includes(searchText) ||
      entry.quantite.toString().includes(searchText) ||
      entry.prixAchat.toString().includes(searchText) ||
      format(new Date(entry.dateEntree), 'dd/MM/yyyy').includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entrées de Stock</h1>
          <p className="text-muted-foreground">
            Gestion des approvisionnements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/products">
              <Package className="mr-2 h-4 w-4" />
              Produits
            </Link>
          </Button>
          <Button asChild>
            <Link to="/stock-entries/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle entrée
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Historique des entrées en stock</CardTitle>
          <CardDescription>
            Registre des produits ajoutés au stock
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
                  <TableHead>Produit</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix Achat (DH)</TableHead>
                  <TableHead className="text-right">Total (DH)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      Aucune entrée trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry: StockEntry) => {
                    const product = entry.idProduct ? getProductById(entry.idProduct) : null;
                    const supplier = entry.idFournisseur ? getSupplierById(entry.idFournisseur) : null;
                    const total = entry.quantite * entry.prixAchat;
                    
                    return (
                      <TableRow key={entry.idEntree}>
                        <TableCell className="font-medium">{entry.idEntree}</TableCell>
                        <TableCell>
                          {format(new Date(entry.dateEntree), 'dd/MM/yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>{product?.nomProduit || 'N/A'}</TableCell>
                        <TableCell>{supplier?.nomFournisseur || 'N/A'}</TableCell>
                        <TableCell className="text-right">{entry.quantite}</TableCell>
                        <TableCell className="text-right">{entry.prixAchat.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">{total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/stock-entries/${entry.idEntree}`}>
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Détails</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/stock-entries/${entry.idEntree}/edit`}>
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

export default StockEntriesPage;
