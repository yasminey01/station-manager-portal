
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sales, pumps, employees } from '@/services/mockDatabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { ArrowLeft, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  quantiteVente: z.number().positive("La quantité doit être positive").or(z.string().transform(v => parseFloat(v) || 0)),
  modePaiement: z.string().min(1, "Le mode de paiement est requis"),
  idPompe: z.number().optional().or(z.string().transform(v => v === "non_assigne" ? undefined : v ? parseInt(v) : undefined)),
  idEmployee: z.number().optional().or(z.string().transform(v => v === "non_assigne" ? undefined : v ? parseInt(v) : undefined)),
  montant: z.number().optional().or(z.string().transform(v => v ? parseFloat(v) : undefined))
});

type FormValues = z.infer<typeof formSchema>;

const SaleForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantiteVente: 0,
      modePaiement: "Espèces",
      idPompe: undefined,
      idEmployee: undefined,
      montant: undefined
    },
  });

  useEffect(() => {
    const initForm = async () => {
      if (isEditing && id) {
        const saleId = parseInt(id, 10);
        const saleData = sales.find(s => s.idVente === saleId);
        
        if (saleData) {
          form.reset({
            quantiteVente: saleData.quantiteVente,
            modePaiement: saleData.modePaiement,
            idPompe: saleData.idPompe,
            idEmployee: saleData.idEmployee,
            montant: saleData.montant
          });
        } else {
          toast.error("Vente non trouvée");
          navigate('/sales');
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
        toast.success("Vente mise à jour avec succès");
      } else {
        toast.success("Vente créée avec succès");
      }
      
      navigate('/sales');
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
          <Link to="/sales">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Modifier la vente' : 'Enregistrer une vente'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informations de la vente
              </CardTitle>
              <CardDescription>
                Détails de la vente de carburant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idPompe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pompe</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={value => field.onChange(value === "non_assigne" ? undefined : value ? parseInt(value) : undefined)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une pompe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non_assigne">Non assigné</SelectItem>
                            {pumps.map(pump => (
                              <SelectItem key={pump.idPompe} value={pump.idPompe.toString()}>
                                {pump.nomPompe}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idEmployee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employé</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={value => field.onChange(value === "non_assigne" ? undefined : value ? parseInt(value) : undefined)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un employé" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non_assigne">Non assigné</SelectItem>
                            {employees.map(employee => (
                              <SelectItem key={employee.idEmployee} value={employee.idEmployee.toString()}>
                                {employee.firstName} {employee.lastName}
                              </SelectItem>
                            ))}
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
                  name="quantiteVente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité (L)</FormLabel>
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
                  name="montant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant (DH)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="400.00" 
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Le montant total de la vente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="modePaiement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un mode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Espèces">Espèces</SelectItem>
                          <SelectItem value="Carte">Carte</SelectItem>
                          <SelectItem value="Virement">Virement</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" asChild>
                <Link to="/sales">Annuler</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default SaleForm;
