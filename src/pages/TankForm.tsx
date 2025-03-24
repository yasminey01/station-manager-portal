
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tanks, stations } from '@/services/mockDatabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tank } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Fuel, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const formSchema = z.object({
  typeCarburant: z.string().min(2, "Le type de carburant est requis"),
  capacite: z.number().or(z.string().transform(v => parseFloat(v) || 0)),
  dateInstallation: z.date(),
  statut: z.string().min(1, "Le statut est requis"),
  idStation: z.number().optional().or(z.string().transform(v => v ? parseInt(v) : undefined)),
  niveauActuel: z.number().optional().or(z.string().transform(v => v ? parseFloat(v) : undefined)),
});

type FormValues = z.infer<typeof formSchema>;

const TankForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeCarburant: "",
      capacite: 0,
      dateInstallation: new Date(),
      statut: "actif",
      idStation: undefined,
      niveauActuel: undefined,
    },
  });

  useEffect(() => {
    const initForm = async () => {
      if (isEditing && id) {
        const tankId = parseInt(id, 10);
        const tankData = tanks.find(t => t.idCiterne === tankId);
        
        if (tankData) {
          form.reset({
            typeCarburant: tankData.typeCarburant,
            capacite: tankData.capacite,
            dateInstallation: new Date(tankData.dateInstallation),
            statut: tankData.statut,
            idStation: tankData.idStation,
            niveauActuel: tankData.niveauActuel,
          });
        } else {
          toast.error("Citerne non trouvée");
          navigate('/pumps-and-tanks');
        }
      }
      
      setLoading(false);
    };
    
    initForm();
  }, [isEditing, id, form, navigate]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        toast.success("Citerne mise à jour avec succès");
      } else {
        toast.success("Citerne créée avec succès");
      }
      
      navigate('/pumps-and-tanks');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse h-8 w-8 rounded-full bg-primary/40"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/pumps-and-tanks">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Modifier la citerne' : 'Ajouter une citerne'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Informations de la citerne
              </CardTitle>
              <CardDescription>
                Informations détaillées de la citerne de stockage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="typeCarburant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de carburant</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Essence">Essence</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Sans Plomb">Sans Plomb</SelectItem>
                            <SelectItem value="Diesel Premium">Diesel Premium</SelectItem>
                            <SelectItem value="E85">E85</SelectItem>
                            <SelectItem value="GPL">GPL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="capacite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacité (litres)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="20000" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dateInstallation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date d'installation</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={value => field.onChange(value ? parseInt(value) : undefined)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une station" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Non assigné</SelectItem>
                            {stations.map(station => (
                              <SelectItem key={station.idStation} value={station.idStation.toString()}>
                                {station.nomStation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Station à laquelle cette citerne est assignée
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="niveauActuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau actuel (litres)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Niveau actuel de carburant dans la citerne
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" asChild>
                <Link to="/pumps-and-tanks">Annuler</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Mettre à jour' : 'Créer la citerne'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default TankForm;
