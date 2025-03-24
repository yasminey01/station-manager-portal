
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStationById, getServicesByStationId, services as allServices } from '@/services/mockDatabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Station, Service } from '@/types';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  nomStation: z.string().min(2, "Le nom est requis"),
  adresseStation: z.string().min(2, "L'adresse est requise"),
  villeStation: z.string().min(2, "La ville est requise"),
  latitude: z.number().or(z.string().transform(v => parseFloat(v) || 0)),
  longitude: z.number().or(z.string().transform(v => parseFloat(v) || 0)),
  telephone: z.string().min(8, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide"),
  horairesOuverture: z.string().min(2, "Les horaires sont requis"),
  statut: z.enum(["actif", "inactif"]),
  services: z.array(z.number()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const StationForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomStation: "",
      adresseStation: "",
      villeStation: "",
      latitude: 0,
      longitude: 0,
      telephone: "",
      email: "",
      horairesOuverture: "",
      statut: "actif",
      services: [],
    },
  });

  useEffect(() => {
    const initForm = async () => {
      if (isEditing && id) {
        const stationId = parseInt(id, 10);
        const stationData = getStationById(stationId);
        const stationServices = getServicesByStationId(stationId);
        
        if (stationData) {
          form.reset({
            nomStation: stationData.nomStation,
            adresseStation: stationData.adresseStation,
            villeStation: stationData.villeStation,
            latitude: stationData.latitude,
            longitude: stationData.longitude,
            telephone: stationData.telephone,
            email: stationData.email,
            horairesOuverture: stationData.horairesOuverture,
            statut: stationData.statut,
            services: stationServices.map(service => service.idService),
          });
          
          setSelectedServices(stationServices.map(service => service.idService));
        } else {
          toast.error("Station non trouvée");
          navigate('/stations');
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
        toast.success("Station mise à jour avec succès");
      } else {
        toast.success("Station créée avec succès");
      }
      
      navigate('/stations');
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
          <Link to="/stations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Modifier la station' : 'Ajouter une station'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Informations de base de la station
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la station</FormLabel>
                      <FormControl>
                        <Input placeholder="Station Centrale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="villeStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Casablanca" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="adresseStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Avenue de la République" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001" 
                          placeholder="33.5731" 
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
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001" 
                          placeholder="-7.5898" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact et disponibilité</CardTitle>
              <CardDescription>
                Informations de contact et horaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+212 522 123 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@station.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="horairesOuverture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaires d'ouverture</FormLabel>
                    <FormControl>
                      <Input placeholder="06:00-22:00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Format: HH:MM-HH:MM ou texte (24h/24)
                    </FormDescription>
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
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Services disponibles</CardTitle>
              <CardDescription>
                Services offerts par cette station
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {allServices.map((service) => (
                        <FormField
                          key={service.idService}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.idService}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.idService)}
                                    onCheckedChange={(checked) => {
                                      const currentServices = [...field.value];
                                      if (checked) {
                                        field.onChange([...currentServices, service.idService]);
                                      } else {
                                        field.onChange(
                                          currentServices.filter((value) => value !== service.idService)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {service.nomService}
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    {service.description}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" asChild>
                <Link to="/stations">Annuler</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Mettre à jour' : 'Créer la station'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default StationForm;
