
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Fuel, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  AlertTriangle,
  XCircle
} from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Pump, Tank } from '@/types';
import { pumps, tanks, stations } from '@/services/mockDatabase';
import { toast } from 'sonner';

const PumpsAndTanks = () => {
  const [activeTab, setActiveTab] = useState('pumps');
  const [searchQuery, setSearchQuery] = useState('');
  const [pumpsData, setPumpsData] = useState<Pump[]>(pumps);
  const [tanksData, setTanksData] = useState<Tank[]>(tanks);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'pump' | 'tank' } | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    station: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter pumps based on search query and filters
  const filteredPumps = pumpsData.filter(pump => {
    // Search filter
    const matchesSearch = 
      pump.nomPompe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.statut.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status ? pump.statut === filters.status : true;
    
    // Station filter
    const matchesStation = filters.station 
      ? pump.idStation?.toString() === filters.station 
      : true;
    
    return matchesSearch && matchesStatus && matchesStation;
  });

  // Filter tanks based on search query and filters
  const filteredTanks = tanksData.filter(tank => {
    // Search filter
    const matchesSearch = 
      tank.typeCarburant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tank.statut.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status ? tank.statut === filters.status : true;
    
    // Station filter
    const matchesStation = filters.station 
      ? tank.idStation?.toString() === filters.station 
      : true;
    
    return matchesSearch && matchesStatus && matchesStation;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      station: ''
    });
    setShowFilters(false);
  };

  const handleDelete = (id: number, type: 'pump' | 'tank') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'pump') {
      setPumpsData(prev => prev.filter(pump => pump.idPompe !== itemToDelete.id));
      toast.success('Pompe supprimée avec succès');
    } else {
      setTanksData(prev => prev.filter(tank => tank.idCiterne !== itemToDelete.id));
      toast.success('Citerne supprimée avec succès');
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const getStationName = (id?: number) => {
    if (!id) return 'Non assigné';
    const station = stations.find(s => s.idStation === id);
    return station ? station.nomStation : 'Non assigné';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des pompes et citernes</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les pompes de carburant et les citernes de stockage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/pumps/new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle pompe
            </Link>
          </Button>
          <Button asChild>
            <Link to="/tanks/new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle citerne
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {(filters.status || filters.station) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              )}
              <span className="sr-only">Filtrer</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Filtres</h4>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Statut</h5>
                <div className="flex gap-2">
                  <Button 
                    variant={filters.status === 'actif' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleFilterChange('status', filters.status === 'actif' ? '' : 'actif')}
                  >
                    Actif
                  </Button>
                  <Button 
                    variant={filters.status === 'inactif' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleFilterChange('status', filters.status === 'inactif' ? '' : 'inactif')}
                  >
                    Inactif
                  </Button>
                  <Button 
                    variant={filters.status === 'maintenance' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleFilterChange('status', filters.status === 'maintenance' ? '' : 'maintenance')}
                  >
                    Maintenance
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Station</h5>
                <div className="grid grid-cols-2 gap-2">
                  {stations.slice(0, 4).map(station => (
                    <Button 
                      key={station.idStation}
                      variant={filters.station === station.idStation.toString() ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFilterChange('station', 
                        filters.station === station.idStation.toString() ? '' : station.idStation.toString()
                      )}
                    >
                      {station.nomStation}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="pumps" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pumps">Pompes</TabsTrigger>
          <TabsTrigger value="tanks">Citernes</TabsTrigger>
        </TabsList>

        <TabsContent value="pumps">
          <Card>
            <CardHeader>
              <CardTitle>Pompes à carburant</CardTitle>
              <CardDescription>
                Gérez les pompes à carburant de vos stations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPumps.length === 0 ? (
                <div className="text-center py-6">
                  <div className="flex justify-center">
                    <Fuel className="h-10 w-10 text-muted-foreground/80" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Aucune pompe trouvée</h3>
                  <p className="text-muted-foreground">
                    Aucune pompe ne correspond à votre recherche ou à vos filtres.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom/Numéro</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead>Débit (L/min)</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPumps.map((pump) => (
                        <TableRow key={pump.idPompe}>
                          <TableCell className="font-medium">
                            {pump.nomPompe}
                          </TableCell>
                          <TableCell>
                            {getStationName(pump.idStation)}
                          </TableCell>
                          <TableCell>{pump.debit} L/min</TableCell>
                          <TableCell>
                            <Badge
                              variant={pump.statut === 'actif' ? 'default' : 'destructive'}
                            >
                              {pump.statut === 'actif' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/pumps/${pump.idPompe}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(pump.idPompe, 'pump')}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tanks">
          <Card>
            <CardHeader>
              <CardTitle>Citernes de stockage</CardTitle>
              <CardDescription>
                Gérez les citernes de stockage de vos stations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTanks.length === 0 ? (
                <div className="text-center py-6">
                  <div className="flex justify-center">
                    <Fuel className="h-10 w-10 text-muted-foreground/80" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Aucune citerne trouvée</h3>
                  <p className="text-muted-foreground">
                    Aucune citerne ne correspond à votre recherche ou à vos filtres.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de carburant</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead>Capacité (L)</TableHead>
                        <TableHead>Date d'installation</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTanks.map((tank) => (
                        <TableRow key={tank.idCiterne}>
                          <TableCell className="font-medium">
                            {tank.typeCarburant}
                          </TableCell>
                          <TableCell>
                            {getStationName(tank.idStation)}
                          </TableCell>
                          <TableCell>{tank.capacite.toLocaleString()} L</TableCell>
                          <TableCell>
                            {new Date(tank.dateInstallation).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tank.statut === 'actif' 
                                  ? 'default' 
                                  : tank.statut === 'maintenance' 
                                    ? 'secondary' 
                                    : 'destructive'
                              }
                            >
                              {tank.statut === 'actif' 
                                ? 'Actif' 
                                : tank.statut === 'maintenance' 
                                  ? 'Maintenance' 
                                  : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/tanks/${tank.idCiterne}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(tank.idCiterne, 'tank')}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {itemToDelete?.type === 'pump' ? 'cette pompe' : 'cette citerne'} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PumpsAndTanks;
