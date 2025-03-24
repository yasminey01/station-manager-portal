
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pumps, stations } from '@/services/mockDatabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pump } from '@/types';
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
import { ArrowLeft, Loader2, Fuel } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  nomPompe: z.string().min(2, "Le nom est requis"),
  numero: z.number().optional().or(z.string().transform(v => v ? parseInt(v) : undefined)),
  statut: z.string().min(1, "Le statut est requis"),
  debit: z.number().or(z.string().transform(v => parseFloat(v) || 0)),
  idStation: z.number().optional().or(z.string().transform(v => v ? parseInt(v) : undefined)),
});

type FormValues = z.infer<typeof formSchema>;

const PumpForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomPompe: "",
      numero: undefined,
      statut: "actif",
      debit: 0,
      idStation: undefined,
    },
  });

  useEffect(() => {
    const initForm = async () => {
      if (isEditing && id) {
        const pumpId = parseInt(id, 10);
        const pumpData = pumps.find(p => p.idPompe === pumpId);
        
        if (pumpData) {
          form.reset({
            nomPompe: pumpData.nomPompe,
            numero: pumpData.numero,
            statut: pumpData.statut,
            debit: pumpData.debit,
            idStation: pumpData.idStation,
          });
        } else {
          toast.error("Pompe non trouvée");
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
        toast.success("Pompe mise à jour avec succès");
      } else {
        toast.success("Pompe créée avec succès");
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
          {isEditing ? 'Modifier la pompe' : 'Ajouter une pompe'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Informations de la pompe
              </CardTitle>
              <CardDescription>
                Informations détaillées de la pompe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomPompe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la pompe</FormLabel>
                      <FormControl>
                        <Input placeholder="P1-Essence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de la pompe</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                          value={field.value === undefined ? '' : field.value}
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
                  name="debit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Débit (L/min)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          placeholder="40" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
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
                          <SelectItem value="non_assigne">Non assigné</SelectItem>
                          {stations.map(station => (
                            <SelectItem key={station.idStation} value={station.idStation.toString()}>
                              {station.nomStation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Station à laquelle cette pompe est assignée
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" asChild>
                <Link to="/pumps-and-tanks">Annuler</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Mettre à jour' : 'Créer la pompe'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PumpForm;
