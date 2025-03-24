
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEmployeeById, getSchedulesByEmployeeId, stations } from '@/services/mockDatabase';
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
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle,
  MapPin,
  UserCircle,
  CreditCard,
  Briefcase,
  Flag
} from 'lucide-react';
import { Employee, Schedule } from '@/types';
import { toast } from 'sonner';

// Helper function to get day name from day number
const getDayName = (day: number): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day === 7 ? 0 : day];
};

// Helper function to get station name from id
const getStationName = (id: number): string => {
  const station = stations.find(s => s.idStation === id);
  return station ? station.nomStation : 'Station inconnue';
};

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const employeeId = parseInt(id, 10);
    const employeeData = getEmployeeById(employeeId);
    
    if (employeeData) {
      setEmployee(employeeData);
      setSchedules(getSchedulesByEmployeeId(employeeId));
    } else {
      toast.error("Employé non trouvé");
      navigate('/employees');
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

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Employé non trouvé</h1>
        <p className="text-muted-foreground">
          L'employé que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button asChild>
          <Link to="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux employés
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
            <Link to="/employees">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{employee.firstName} {employee.lastName}</h1>
            <p className="text-muted-foreground">
              ID: {employee.idEmployee} | CIN: {employee.idCard}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/employees/${employee.idEmployee}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => {
            toast.success("Employé supprimé avec succès");
            navigate('/employees');
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Détails de l'employé</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Statut</div>
              <div>
                <Badge variant={employee.status === 'actif' ? 'outline' : 'secondary'} className="capitalize">
                  {employee.status === 'actif' ? (
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  {employee.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Informations de base</div>
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span>
                  {employee.gender === 'homme' ? 'Homme' : 'Femme'} | Né(e) le {new Date(employee.birthDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Identité</div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>CIN: {employee.idCard}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span>Nationalité: {employee.nationality}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Contact</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{employee.address}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Emploi</div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>Contrat: {employee.contractType}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>CNSS: {employee.cnssNumber}</span>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {employee.salary.toLocaleString('fr-FR')} DH
                </div>
                <div className="text-sm text-muted-foreground mt-1">Salaire mensuel</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Planification
            </CardTitle>
            <CardDescription>Horaires de travail de l'employé</CardDescription>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Aucun horaire planifié pour cet employé
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semaine</TableHead>
                      <TableHead>Jour</TableHead>
                      <TableHead>Horaire</TableHead>
                      <TableHead>Station</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.idSchedule}>
                        <TableCell>Semaine {schedule.week}</TableCell>
                        <TableCell>{getDayName(schedule.day)}</TableCell>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>
                          <Link 
                            to={`/stations/${schedule.idStation}`} 
                            className="hover:underline text-primary"
                          >
                            {getStationName(schedule.idStation)}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/schedules">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gérer les plannings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetail;
