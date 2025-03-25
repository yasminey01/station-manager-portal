
import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Loader2, UserCheck, UserX, Clock } from 'lucide-react';
import { authService } from '@/services/auth.service';

const EmployeeAttendance = () => {
  const { employee } = useEmployeeAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadAttendance = async () => {
    if (!employee?.idEmployee) return;
    
    setIsLoading(true);
    try {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      
      const startDateStr = format(startOfMonth, 'yyyy-MM-dd');
      const endDateStr = format(endOfMonth, 'yyyy-MM-dd');
      
      const response = await authService.getEmployeeAttendance(
        employee.idEmployee, 
        startDateStr,
        endDateStr
      );
      
      if (response.success) {
        setAttendance(response.data || []);
      } else {
        toast.error("Erreur lors du chargement des présences");
      }
    } catch (error) {
      console.error("Failed to load attendance:", error);
      toast.error("Erreur lors du chargement des présences");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.idEmployee) {
      loadAttendance();
    }
  }, [employee?.idEmployee, selectedDate]);

  const { checkIn, checkOut } = useEmployeeAuth();

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const success = await checkIn();
      if (success) {
        loadAttendance();
      }
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const success = await checkOut();
      if (success) {
        loadAttendance();
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatTimeFromISO = (isoString: string) => {
    if (!isoString) return '-';
    return format(new Date(isoString), 'HH:mm:ss');
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.find(a => format(new Date(a.date), 'yyyy-MM-dd') === today);
  const canCheckIn = employee?.isPresent === false;
  const canCheckOut = employee?.isPresent === true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon pointage</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre pointage et consultez votre historique de présence
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Historique de présence</CardTitle>
            <CardDescription>
              {format(selectedDate, 'MMMM yyyy', { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : attendance.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Heure d'arrivée</TableHead>
                    <TableHead>Heure de départ</TableHead>
                    <TableHead>Commentaires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {record.status === 'present' ? (
                            <>
                              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                              <span>Présent</span>
                            </>
                          ) : record.status === 'late' ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 text-amber-500" />
                              <span>En retard</span>
                            </>
                          ) : (
                            <>
                              <UserX className="mr-2 h-4 w-4 text-red-500" />
                              <span>Absent</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatTimeFromISO(record.checkIn)}</TableCell>
                      <TableCell>{formatTimeFromISO(record.checkOut)}</TableCell>
                      <TableCell>{record.comments || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                Aucun enregistrement de présence pour ce mois
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier</CardTitle>
              <CardDescription>
                Sélectionnez un mois pour voir votre historique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pointage du jour</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || !canCheckIn}
                >
                  {isCheckingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Pointage en cours...
                    </>
                  ) : (
                    "Pointer l'arrivée"
                  )}
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleCheckOut}
                  disabled={isCheckingOut || !canCheckOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Pointage en cours...
                    </>
                  ) : (
                    "Pointer le départ"
                  )}
                </Button>
                
                {todayAttendance && (
                  <div className="rounded-md border p-4 text-sm">
                    <p><strong>Statut:</strong> {todayAttendance.status === 'present' ? 'Présent' : todayAttendance.status === 'late' ? 'En retard' : 'Absent'}</p>
                    {todayAttendance.checkIn && <p><strong>Arrivée:</strong> {formatTimeFromISO(todayAttendance.checkIn)}</p>}
                    {todayAttendance.checkOut && <p><strong>Départ:</strong> {formatTimeFromISO(todayAttendance.checkOut)}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
