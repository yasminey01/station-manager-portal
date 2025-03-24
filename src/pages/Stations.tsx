
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { stations } from '@/services/mockDatabase';
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
  CheckCircle
} from 'lucide-react';
import { Station } from '@/types';
import { toast } from 'sonner';

const Stations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stationList, setStationList] = useState(stations);

  // Filter stations based on search term
  const filteredStations = stationList.filter(station => 
    station.nomStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.villeStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.adresseStation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update station status
  const toggleStatus = (id: number, newStatus: 'actif' | 'inactif') => {
    setStationList(prev => 
      prev.map(station => 
        station.idStation === id 
          ? { ...station, statut: newStatus } 
          : station
      )
    );
    
    toast.success(`Le statut de la station a été mis à jour avec succès.`);
  };

  // Delete station
  const deleteStation = (id: number) => {
    setStationList(prev => prev.filter(station => station.idStation !== id));
    toast.success('La station a été supprimée avec succès.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stations</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos stations-service et leurs informations
          </p>
        </div>
        <Button className="shrink-0" asChild>
          <Link to="/stations/new">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une station
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des stations</CardTitle>
          <CardDescription>
            {filteredStations.length} {filteredStations.length > 1 ? 'stations trouvées' : 'station trouvée'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, ville..."
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Aucune station trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStations.map((station) => (
                    <TableRow key={station.idStation}>
                      <TableCell className="font-medium">{station.nomStation}</TableCell>
                      <TableCell>{station.adresseStation}</TableCell>
                      <TableCell>{station.villeStation}</TableCell>
                      <TableCell>{station.telephone}</TableCell>
                      <TableCell>
                        <Badge variant={station.statut === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                          {station.statut === 'actif' ? (
                            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3 text-red-500" />
                          )}
                          {station.statut}
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
                              <Link to={`/stations/${station.idStation}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/stations/${station.idStation}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(
                                station.idStation, 
                                station.statut === 'actif' ? 'inactif' : 'actif'
                              )}
                            >
                              {station.statut === 'actif' ? (
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
                              onClick={() => deleteStation(station.idStation)}
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

export default Stations;
