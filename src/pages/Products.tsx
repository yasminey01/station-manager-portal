
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, Package } from 'lucide-react';
import { products } from '@/services/mockDatabase';
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
import { Product } from '@/types';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(product => {
    const searchText = searchTerm.toLowerCase();
    
    return (
      product.idProduct.toString().includes(searchText) ||
      product.nomProduit.toLowerCase().includes(searchText) ||
      product.type.toLowerCase().includes(searchText) ||
      product.unite.toLowerCase().includes(searchText)
    );
  });

  const getProductTypeBadge = (type: string) => {
    switch(type) {
      case 'Carburant': return 'default';
      case 'Lubrifiant': return 'secondary';
      case 'Accessoire': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gestion des produits et du stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/stock-entries">
              <Package className="mr-2 h-4 w-4" />
              Entrées Stock
            </Link>
          </Button>
          <Button asChild>
            <Link to="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des produits</CardTitle>
          <CardDescription>
            Produits disponibles et leurs caractéristiques
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
                  <TableHead>Nom du produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: Product) => (
                    <TableRow key={product.idProduct}>
                      <TableCell className="font-medium">{product.idProduct}</TableCell>
                      <TableCell>{product.nomProduit}</TableCell>
                      <TableCell>
                        <Badge variant={getProductTypeBadge(product.type)}>
                          {product.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.unite}</TableCell>
                      <TableCell>
                        {format(new Date(product.date_ajout), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/products/${product.idProduct}`}>
                              <Search className="h-4 w-4" />
                              <span className="sr-only">Détails</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/products/${product.idProduct}/edit`}>
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

export default ProductsPage;
