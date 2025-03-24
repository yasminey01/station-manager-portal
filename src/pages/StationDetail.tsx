
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getStationById, 
  getServicesByStationId, 
  getPumpsByStationId, 
  getTanksByStationId,
  getEmployeesByStationId
} from '@/services/mockDatabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  GasPump,
  Droplets
} from 'lucide-react';
import { Station, Service, Pump, Tank, Employee } from '@/types';
import { toast } from 'sonner';

const StationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const stationId = parseInt(id, 10);
    const stationData = getStationById(stationId);
    
    if (stationData) {
      setStation(stationData);
      setServices(getServicesByStationId(stationId));
      setPumps(getPumpsByStationId(stationId));
      setTanks(getTanksByStationId(stationId));
      setEmployees(getEmployeesByStationId(stationId));
    } else {
      toast.error("Station non trouvée");
      navigate('/stations');
    }
    
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse h-8 w-8 rounded-full bg-primary/40"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Station non trouvée</h1>
        <p className="text-muted-foreground">
          La station que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button asChild>
          <Link to="/stations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux stations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/stations">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{station.nomStation}</h1>
            <p className="text-muted-foreground">
              {station.adresseStation}, {station.villeStation}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/stations/${station.idStation}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => {
            toast.success("Station supprimée avec succès");
            navigate('/stations');
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Détails de la station</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Statut</div>
              <div>
                <Badge variant={station.statut === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                  {station.statut === 'actif' ? (
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  {station.statut}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Adresse</div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{station.adresseStation}, {station.villeStation}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Coordonnées GPS</div>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground">Lat: {station.latitude}</div>
                <div className="text-muted-foreground">Long: {station.longitude}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Contact</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{station.telephone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{station.email}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Horaires</div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{station.horairesOuverture}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Date de mise en service</div>
              <div className="text-muted-foreground">
                {new Date(station.dateMiseEnService).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gestion de la station</CardTitle>
            <CardDescription>Équipements, services et personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="employees">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="employees">
                  <Users className="h-4 w-4 mr-2" />
                  Employés
                </TabsTrigger>
                <TabsTrigger value="pumps">
                  <GasPump className="h-4 w-4 mr-2" />
                  Pompes
                </TabsTrigger>
                <TabsTrigger value="tanks">
                  <Droplets className="h-4 w-4 mr-2" />
                  Citernes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="employees" className="space-y-4">
                {employees.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucun employé affecté à cette station
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Fonction</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.idEmployee}>
                            <TableCell className="font-medium">
                              <Link to={`/employees/${employee.idEmployee}`} className="hover:underline">
                                {employee.firstName} {employee.lastName}
                              </Link>
                            </TableCell>
                            <TableCell>{employee.contractType}</TableCell>
                            <TableCell>{employee.phone}</TableCell>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/employees">
                    <Users className="mr-2 h-4 w-4" />
                    Gérer les employés
                  </Link>
                </Button>
              </TabsContent>
              
              <TabsContent value="pumps" className="space-y-4">
                {pumps.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucune pompe associée à cette station
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Identifiant</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Débit</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pumps.map((pump) => (
                          <TableRow key={pump.idPompe}>
                            <TableCell>{pump.idPompe}</TableCell>
                            <TableCell className="font-medium">{pump.nomPompe}</TableCell>
                            <TableCell>{pump.debit} L/min</TableCell>
                            <TableCell>
                              <Badge variant={pump.statut === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                                {pump.statut === 'actif' ? (
                                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                {pump.statut}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  <GasPump className="mr-2 h-4 w-4" />
                  Gérer les pompes
                </Button>
              </TabsContent>
              
              <TabsContent value="tanks" className="space-y-4">
                {tanks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucune citerne associée à cette station
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Identifiant</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Capacité</TableHead>
                          <TableHead>Installation</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tanks.map((tank) => (
                          <TableRow key={tank.idCiterne}>
                            <TableCell>{tank.idCiterne}</TableCell>
                            <TableCell className="font-medium">{tank.typeCarburant}</TableCell>
                            <TableCell>{tank.capacite} L</TableCell>
                            <TableCell>{new Date(tank.dateInstallation).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>
                              <Badge variant={tank.statut === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                                {tank.statut === 'actif' ? (
                                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                {tank.statut}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  <Droplets className="mr-2 h-4 w-4" />
                  Gérer les citernes
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Services disponibles</CardTitle>
          <CardDescription>Services offerts par cette station</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun service disponible pour cette station
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {services.map((service) => (
                <Card key={service.idService}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{service.nomService}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{service.horaires}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StationDetail;
