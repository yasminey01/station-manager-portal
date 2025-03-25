import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Search, Filter, Check, X, Clock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { employees } from '@/services/mockDatabase';
import { Employee, Attendance } from '@/types';

// Données fictives de présence
const mockAttendance: Attendance[] = [
  {
    id: 1,
    idEmployee: 1,
    date: '2024-03-25',
    checkIn: '08:15',
    checkOut: '17:05',
    status: 'present',
    comments: '',
  },
  {
    id: 2,
    idEmployee: 2,
    date: '2024-03-25',
    checkIn: '08:45',
    status: 'late',
    comments: 'Retard dû aux embouteillages',
  },
  {
    id: 3,
    idEmployee: 3,
    date: '2024-03-25',
    status: 'absent',
    comments: 'Congé maladie',
  },
  {
    id: 4,
    idEmployee: 4,
    date: '2024-03-25',
    checkIn: '08:05',
    checkOut: '12:30',
    status: 'halfDay',
    comments: 'Départ pour rendez-vous médical',
  },
  {
    id: 5,
    idEmployee: 5,
    date: '2024-03-25',
    checkIn: '07:55',
    checkOut: '17:00',
    status: 'present',
    comments: '',
  }
];

const AttendancePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState<Attendance[]>(mockAttendance);
  const [showCalendar, setShowCalendar] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Filter attendance data based on search and filters
  const filteredAttendance = attendanceData.filter(record => {
    // Format date for comparison
    const recordDate = new Date(record.date);
    const selectedDate = new Date(date);
    const isSameDate = 
      recordDate.getDate() === selectedDate.getDate() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getFullYear() === selectedDate.getFullYear();
    
    // Find the employee
    const employee = employees.find(e => e.idEmployee === record.idEmployee);
    if (!employee) return false;
    
    // Filter by search term
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.idCard.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    
    return isSameDate && matchesSearch && matchesStatus;
  });

  const getEmployeeName = (id: number) => {
    const employee = employees.find(e => e.idEmployee === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Présent</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">En retard</Badge>;
      case 'halfDay':
        return <Badge variant="secondary">Demi-journée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleCheckIn = (employeeId: number) => {
    // Check if employee is already checked in
    const existing = attendanceData.find(a => 
      a.idEmployee === employeeId && 
      a.date === format(date, 'yyyy-MM-dd')
    );
    
    if (existing) {
      toast.error("Cet employé est déjà enregistré aujourd'hui");
      return;
    }
    
    // Add check-in record
    const newRecord: Attendance = {
      id: attendanceData.length + 1,
      idEmployee: employeeId,
      date: format(date, 'yyyy-MM-dd'),
      checkIn: format(new Date(), 'HH:mm'),
      status: 'present',
      comments: '',
    };
    
    setAttendanceData([...attendanceData, newRecord]);
    toast.success("Présence enregistrée avec succès");
  };

  const handleCheckOut = (recordId: number) => {
    // Update the record with check-out time
    const updatedData = attendanceData.map(record => 
      record.id === recordId 
        ? { ...record, checkOut: format(new Date(), 'HH:mm') } 
        : record
    );
    
    setAttendanceData(updatedData);
    toast.success("Sortie enregistrée avec succès");
  };

  const handleStatusChange = (recordId: number, newStatus: 'present' | 'absent' | 'late' | 'halfDay') => {
    // Update the record status
    const updatedData = attendanceData.map(record => 
      record.id === recordId 
        ? { ...record, status: newStatus } 
        : record
    );
    
    setAttendanceData(updatedData);
    toast.success("Statut mis à jour avec succès");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des présences</h1>
        <p className="text-muted-foreground mt-2">
          Suivez la présence des employés au quotidien
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'dd MMMM yyyy', { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setShowCalendar(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrer par statut</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="end">
              <div className="space-y-2">
                <h4 className="font-medium">Filtrer par statut</h4>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={statusFilter === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('')}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={statusFilter === 'present' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('present')}
                    className="justify-start"
                  >
                    <Check className="mr-2 h-3 w-3 text-green-500" />
                    Présent
                  </Button>
                  <Button
                    variant={statusFilter === 'absent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('absent')}
                    className="justify-start"
                  >
                    <X className="mr-2 h-3 w-3 text-red-500" />
                    Absent
                  </Button>
                  <Button
                    variant={statusFilter === 'late' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('late')}
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-3 w-3 text-amber-500" />
                    En retard
                  </Button>
                  <Button
                    variant={statusFilter === 'halfDay' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('halfDay')}
                    className="justify-start"
                  >
                    <CalendarDays className="mr-2 h-3 w-3 text-blue-500" />
                    Demi-journée
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feuille de présence</CardTitle>
          <CardDescription>
            {format(date, "EEEE d MMMM yyyy", { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Heure de sortie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucune donnée de présence pour cette journée ou ce filtre
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((record) => {
                    const employee = employees.find(e => e.idEmployee === record.idEmployee);
                    if (!employee) return null;
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {getEmployeeName(record.idEmployee)}
                        </TableCell>
                        <TableCell>{employee.idCard}</TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={record.comments}>
                          {record.comments || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!record.checkIn && (
                              <Button 
                                size="sm" 
                                onClick={() => handleCheckIn(record.idEmployee)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Arrivée
                              </Button>
                            )}
                            {record.checkIn && !record.checkOut && record.status !== 'absent' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCheckOut(record.id)}
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                Sortie
                              </Button>
                            )}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Filter className="h-3 w-3 mr-1" />
                                  Statut
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40" align="end">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(record.id, 'present')}
                                    className="justify-start"
                                  >
                                    <Check className="mr-2 h-3 w-3 text-green-500" />
                                    Présent
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(record.id, 'absent')}
                                    className="justify-start"
                                  >
                                    <X className="mr-2 h-3 w-3 text-red-500" />
                                    Absent
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(record.id, 'late')}
                                    className="justify-start"
                                  >
                                    <Clock className="mr-2 h-3 w-3 text-amber-500" />
                                    En retard
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(record.id, 'halfDay')}
                                    className="justify-start"
                                  >
                                    <CalendarDays className="mr-2 h-3 w-3 text-blue-500" />
                                    Demi-journée
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={() => {
                const employeesWithoutRecord = employees.filter(emp => 
                  !attendanceData.some(record => 
                    record.idEmployee === emp.idEmployee && 
                    record.date === format(date, 'yyyy-MM-dd')
                  )
                );
                
                if (employeesWithoutRecord.length === 0) {
                  toast.info("Tous les employés sont déjà enregistrés pour cette journée");
                  return;
                }
                
                // Add present records for all employees
                const newRecords = employeesWithoutRecord.map((emp, index) => ({
                  id: attendanceData.length + index + 1,
                  idEmployee: emp.idEmployee,
                  date: format(date, 'yyyy-MM-dd'),
                  checkIn: format(new Date(), 'HH:mm'),
                  status: 'present' as 'present',
                  comments: 'Présence enregistrée en masse',
                }));
                
                setAttendanceData([...attendanceData, ...newRecords]);
                toast.success(`${newRecords.length} employés marqués présents`);
              }}
            >
              Marquer tous présents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
