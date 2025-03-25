
import { useState } from 'react';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext'; // Changed from useAuth to useEmployeeAuth
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Fuel, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

const EmployeeLogin = () => {
  const { login } = useEmployeeAuth(); // Changed from loginEmployee to login
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password); // Changed from loginEmployee to login
      navigate('/employee/attendance');
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in the login function which shows a toast
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password');
    toast.info('Identifiants de démo remplis automatiquement');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="w-full max-w-md">
        <div className="animate-slide-up space-y-6 rounded-lg border bg-card p-8 shadow-soft">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Espace Employé</h1>
            <p className="text-sm text-muted-foreground">
              Entrez vos identifiants pour accéder à votre espace personnel
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nom@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className="w-full" type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Compte de démonstration
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" type="button" onClick={() => demoLogin('employee@example.com')}>
              Accès Employé
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate('/login')}>
              Accès Administrateur / Gestionnaire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
