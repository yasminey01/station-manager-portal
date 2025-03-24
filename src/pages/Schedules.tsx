
import { useState, useEffect } from 'react';
import { format, getWeek as getDateFnsWeek, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEmployees, getSchedules, getStations } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, CalendarPlus, Clock, X } from 'lucide-react';
import { Schedule, Employee, Station } from '@/types';
import { toast } from 'sonner';

// Helper to get the week day name
const getDayName = (day: number): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day === 7 ? 0 : day];
};

// Helper to get a color based on employee ID (for visual identification)
const getEmployeeColor = (id: number): string => {
  const colors = [
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-green-100 border-green-300 text-green-800',
    'bg-yellow-100 border-yellow-300 text-yellow-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-indigo-100 border-indigo-300 text-indigo-800',
    'bg-red-100 border-red-300 text-red-800',
    'bg-orange-100 border-orange-300 text-orange-800',
  ];
  return colors[id % colors.length];
};

// Get employee name by ID
const getEmployeeName = (employees: Employee[], id: number): string => {
  const employee = employees.find(e => e.idEmployee === id);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
};

// Get station name by ID
const getStationName = (stations: Station[], id: number): string => {
  const station = stations.find(s => s.idStation === id);
  return station ? station.nomStation : 'Station inconnue';
};

// Format time for display
const formatTime = (time: string): string => {
  return time;
};

const Schedules = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({});
  
  // Calculate the current week number
  const currentWeek = getDateFnsWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate the days for current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    return {
      day: i + 1, // 1 = Monday, 7 = Sunday
      name: format(day, 'EEEE', { locale: fr }),
      date: format(day, 'dd/MM/yyyy'),
      dateObj: day
    };
  });
  
  useEffect(() => {
    // Load data when component mounts
    setEmployees(getEmployees());
    setStations(getStations());
    const allSchedules = getSchedules();
    
    // Filter schedules for current week
    const filteredSchedules = allSchedules.filter(
      schedule => schedule.week === currentWeek
    );
    
    setSchedules(filteredSchedules);
  }, [currentWeek]);
  
  const nextWeek = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextDate);
  };
  
  const prevWeek = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevDate);
  };
  
  const handleAddSchedule = () => {
    if (!newSchedule.idEmployee || !newSchedule.idStation || !newSchedule.day || !newSchedule.startTime || !newSchedule.endTime) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    // Generate a simple ID for the new schedule
    const newId = Math.max(0, ...schedules.map(s => s.idSchedule)) + 1;
    
    // Create the complete schedule object
    const completeSchedule: Schedule = {
      idSchedule: newId,
      week: currentWeek,
      idEmployee: Number(newSchedule.idEmployee),
      idStation: Number(newSchedule.idStation),
      day: Number(newSchedule.day),
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime
    };
    
    // Add the new schedule to state
    setSchedules(prev => [...prev, completeSchedule]);
    
    // Reset form and close dialog
    setNewSchedule({});
    setIsAddDialogOpen(false);
    toast.success("Horaire ajouté avec succès");
  };
  
  const handleRemoveSchedule = (id: number) => {
    setSchedules(prev => prev.filter(schedule => schedule.idSchedule !== id));
    toast.success("Horaire supprimé avec succès");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planification</h1>
          <p className="text-muted-foreground">
            Gestion des horaires et affectations des employés
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <div className="px-3 py-1.5 rounded-md bg-primary/10 font-medium text-sm">
            Semaine {currentWeek}
          </div>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un horaire</DialogTitle>
                <DialogDescription>
                  Créer un nouvel horaire pour la semaine {currentWeek}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Employé
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewSchedule({...newSchedule, idEmployee: Number(value)})}
                    value={newSchedule.idEmployee?.toString()}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.idEmployee} value={employee.idEmployee.toString()}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station" className="text-right">
                    Station
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewSchedule({...newSchedule, idStation: Number(value)})}
                    value={newSchedule.idStation?.toString()}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map(station => (
                        <SelectItem key={station.idStation} value={station.idStation.toString()}>
                          {station.nomStation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="day" className="text-right">
                    Jour
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewSchedule({...newSchedule, day: Number(value)})}
                    value={newSchedule.day?.toString()}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un jour" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map(day => (
                        <SelectItem key={day.day} value={day.day.toString()}>
                          {day.name} - {day.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Heure début
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="col-span-3"
                    value={newSchedule.startTime || ''}
                    onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    Heure fin
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="col-span-3"
                    value={newSchedule.endTime || ''}
                    onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" onClick={handleAddSchedule}>
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(day => (
          <Card key={day.day} className="overflow-hidden">
            <CardHeader className="p-4 pb-2 bg-muted/50">
              <CardTitle className="text-base">{day.name}</CardTitle>
              <CardDescription>{day.date}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 min-h-[200px]">
              {schedules
                .filter(schedule => schedule.day === day.day)
                .map(schedule => (
                  <div 
                    key={schedule.idSchedule} 
                    className={`mb-2 p-2 text-xs rounded border ${getEmployeeColor(schedule.idEmployee)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{getEmployeeName(employees, schedule.idEmployee)}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => handleRemoveSchedule(schedule.idSchedule)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 opacity-70" />
                      <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                    </div>
                    <div className="mt-1 text-[10px] opacity-80">
                      {getStationName(stations, schedule.idStation)}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
