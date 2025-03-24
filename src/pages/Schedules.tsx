
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schedules, employees, stations } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Input
} from "@/components/ui/input";
import { 
  Plus, 
  Edit, 
  Trash2,
  Loader2,
  Filter
} from 'lucide-react';
import { Schedule } from '@/types';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Helper function to get day name from day number
const getDayName = (day: number): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day === 7 ? 0 : day];
};

// Helper function to get employee full name from id
const getEmployeeName = (id: number): string => {
  const employee = employees.find(e => e.idEmployee === id);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
};

// Helper function to get station name from id
const getStationName = (id: number): string => {
  const station = stations.find(s => s.idStation === id);
  return station ? station.nomStation : 'Station inconnue';
};

const formSchema = z.object({
  idEmployee: z.number({
    required_error: "L'employé est requis"
  }),
  idStation: z.number({
    required_error: "La station est requise"
  }),
  week: z.number({
    required_error: "La semaine est requise"
  }).min(1, "La semaine doit être supérieure à 0").max(53, "La semaine doit être inférieure à 53"),
  day: z.number({
    required_error: "Le jour est requis"
  }).min(1, "Le jour doit être entre 1 et 7").max(7, "Le jour doit être entre 1 et 7"),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
});

type FormValues = z.infer<typeof formSchema>;

const Schedules = () => {
  const [scheduleList, setScheduleList] = useState(schedules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [filter, setFilter] = useState({
    employee: "all",
    station: "all",
    week: "all"
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idEmployee: 0,
      idStation: 0,
      week: new Date().getWeek(),
      day: 1,
      startTime: "08:00",
      endTime: "16:00",
    },
  });

  // Helper function to get the current week number
  Date.prototype.getWeek = function() {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  useEffect(() => {
    if (editingSchedule) {
      form.reset({
        idEmployee: editingSchedule.idEmployee,
        idStation: editingSchedule.idStation,
        week: editingSchedule.week,
        day: editingSchedule.day,
        startTime: editingSchedule.startTime,
        endTime: editingSchedule.endTime,
      });
    } else {
      form.reset({
        idEmployee: 0,
        idStation: 0,
        week: new Date().getWeek(),
        day: 1,
        startTime: "08:00",
        endTime: "16:00",
      });
    }
  }, [editingSchedule, form]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingSchedule) {
        // Update existing schedule
        setScheduleList(prev => 
          prev.map(schedule => 
            schedule.idSchedule === editingSchedule.idSchedule 
              ? { ...values, idSchedule: editingSchedule.idSchedule } 
              : schedule
          )
        );
        toast.success("Planning mis à jour avec succès");
      } else {
        // Create new schedule
        const newSchedule: Schedule = {
          ...values,
          idSchedule: Math.max(...scheduleList.map(s => s.idSchedule)) + 1
        };
        setScheduleList(prev => [...prev, newSchedule]);
        toast.success("Planning créé avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSchedule = (id: number) => {
    setScheduleList(prev => prev.filter(schedule => schedule.idSchedule !== id));
    toast.success("Planning supprimé avec succès");
  };

  const editSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  const resetDialog = () => {
    setEditingSchedule(null);
    setIsDialogOpen(false);
  };

  // Filter schedules based on filter criteria
  const filteredSchedules = scheduleList.filter(schedule => {
    return (
      (filter.employee === "all" || schedule.idEmployee === parseInt(filter.employee)) &&
      (filter.station === "all" || schedule.idStation === parseInt(filter.station)) &&
      (filter.week === "all" || schedule.week === parseInt(filter.week))
    );
  });

  // Generate weeks options (1-52)
  const weeksOptions = Array.from({ length: 53 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Semaine ${i + 1}`
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planification</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les horaires et affectations des employés
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un planning
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Modifier le planning' : 'Ajouter un planning'}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule 
                  ? 'Modifiez les détails du planning sélectionné' 
                  : 'Définissez un nouveau planning pour un employé'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="idEmployee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employé</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un employé" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem 
                              key={employee.idEmployee} 
                              value={employee.idEmployee.toString()}
                            >
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem 
                              key={station.idStation} 
                              value={station.idStation.toString()}
                            >
                              {station.nomStation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semaine</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="53" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jour</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Jour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Lundi</SelectItem>
                            <SelectItem value="2">Mardi</SelectItem>
                            <SelectItem value="3">Mercredi</SelectItem>
                            <SelectItem value="4">Jeudi</SelectItem>
                            <SelectItem value="5">Vendredi</SelectItem>
                            <SelectItem value="6">Samedi</SelectItem>
                            <SelectItem value="7">Dimanche</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de début</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de fin</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetDialog}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingSchedule ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Plannings</CardTitle>
          <CardDescription>
            Horaires de travail des employés par station
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Filtres:</span>
            </div>
            
            <Select
              value={filter.employee}
              onValueChange={(value) => setFilter({...filter, employee: value})}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {employees.map((employee) => (
                  <SelectItem 
                    key={employee.idEmployee} 
                    value={employee.idEmployee.toString()}
                  >
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.station}
              onValueChange={(value) => setFilter({...filter, station: value})}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem 
                    key={station.idStation} 
                    value={station.idStation.toString()}
                  >
                    {station.nomStation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.week}
              onValueChange={(value) => setFilter({...filter, week: value})}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les semaines</SelectItem>
                {weeksOptions.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter({employee: "all", station: "all", week: "all"})}
            >
              Réinitialiser
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semaine</TableHead>
                  <TableHead>Jour</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Aucun planning trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.idSchedule}>
                      <TableCell>Semaine {schedule.week}</TableCell>
                      <TableCell>{getDayName(schedule.day)}</TableCell>
                      <TableCell>
                        <Link 
                          to={`/employees/${schedule.idEmployee}`}
                          className="hover:underline text-primary"
                        >
                          {getEmployeeName(schedule.idEmployee)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/stations/${schedule.idStation}`}
                          className="hover:underline text-primary"
                        >
                          {getStationName(schedule.idStation)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {schedule.startTime} - {schedule.endTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => editSchedule(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteSchedule(schedule.idSchedule)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Supprimer</span>
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

export default Schedules;
