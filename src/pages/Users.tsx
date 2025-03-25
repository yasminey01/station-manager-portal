
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  XCircle,
  UserCog,
  Mail,
  Phone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

// Données fictives pour les utilisateurs
const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    telephone: '+212 654 987 321',
    role: 'admin',
    photoUrl: '',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@example.com',
    telephone: '+212 654 123 789',
    role: 'manager',
    photoUrl: '',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    telephone: '+212 651 234 567',
    role: 'manager',
    photoUrl: '',
    status: 'inactive',
  },
  {
    id: 4,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    telephone: '+212 652 345 678',
    role: 'manager',
    photoUrl: '',
    status: 'active',
  },
];

// Schéma de validation pour le formulaire de création d'utilisateur
const userFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  role: z.enum(["admin", "manager", "employee"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UsersPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Vérifie si l'utilisateur actuel est admin
  const isAdmin = user?.role === 'admin';

  // Formulaire pour l'ajout d'utilisateur
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      role: 'manager',
      password: '',
      confirmPassword: '',
    }
  });

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telephone.includes(searchTerm);
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Gérer la soumission du formulaire
  const onSubmit = (values: UserFormValues) => {
    // Simuler l'ajout d'un utilisateur
    const newUser = {
      id: users.length + 1,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      telephone: values.telephone,
      role: values.role,
      photoUrl: '',
      status: 'active',
    };
    
    setUsers([...users, newUser]);
    setDialogOpen(false);
    form.reset();
    toast.success("Utilisateur créé avec succès");
  };

  // Changer le statut d'un utilisateur
  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    toast.success("Statut de l'utilisateur mis à jour");
  };

  // Changer le rôle d'un utilisateur
  const changeUserRole = (userId: number, newRole: 'admin' | 'manager' | 'employee') => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, role: newRole }
        : user
    ));
    
    toast.success("Rôle de l'utilisateur mis à jour");
  };

  // Obtenir l'icône et la couleur selon le rôle
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-600">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'manager':
        return (
          <Badge variant="secondary">
            <UserCog className="h-3 w-3 mr-1" />
            Gestionnaire
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Employé
          </Badge>
        );
    }
  };

  // Obtenir l'badge selon le statut
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="default" className="bg-green-600">Actif</Badge>
      : <Badge variant="destructive">Inactif</Badge>;
  };

  // Générer les initiales pour l'avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un compte utilisateur
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="+212 654 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="admin">Administrateur</option>
                          <option value="manager">Gestionnaire</option>
                          <option value="employee">Employé</option>
                        </select>
                        <FormDescription>
                          Définit les permissions de l'utilisateur dans le système
                        </FormDescription>
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
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button type="submit">Créer l'utilisateur</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter className="h-4 w-4" />
                {(roleFilter || statusFilter) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filtres</h4>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Rôle</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={roleFilter === '' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setRoleFilter('')}
                    >
                      Tous
                    </Button>
                    <Button 
                      variant={roleFilter === 'admin' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setRoleFilter(roleFilter === 'admin' ? '' : 'admin')}
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Admin
                    </Button>
                    <Button 
                      variant={roleFilter === 'manager' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setRoleFilter(roleFilter === 'manager' ? '' : 'manager')}
                    >
                      <UserCog className="h-3 w-3 mr-1" />
                      Gestionnaire
                    </Button>
                    <Button 
                      variant={roleFilter === 'employee' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setRoleFilter(roleFilter === 'employee' ? '' : 'employee')}
                    >
                      Employé
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Statut</h5>
                  <div className="flex gap-2">
                    <Button 
                      variant={statusFilter === '' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setStatusFilter('')}
                    >
                      Tous
                    </Button>
                    <Button 
                      variant={statusFilter === 'active' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === 'active' ? '' : 'active')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Actif
                    </Button>
                    <Button 
                      variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === 'inactive' ? '' : 'inactive')}
                      className={statusFilter === 'inactive' ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      Inactif
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setRoleFilter('');
                      setStatusFilter('');
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Effacer les filtres
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} {filteredUsers.length > 1 ? 'utilisateurs trouvés' : 'utilisateur trouvé'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]"></TableHead>
                  <TableHead>Nom & Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.telephone}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem onClick={() => {
                                // Code pour modifier l'utilisateur
                                toast.info("Fonctionnalité de modification en développement");
                              }}>
                                Modifier
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                {user.status === 'active' ? 'Désactiver' : 'Activer'}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuLabel>Changer le rôle</DropdownMenuLabel>
                              <DropdownMenuItem 
                                disabled={user.role === 'admin'} 
                                onClick={() => changeUserRole(user.id, 'admin')}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Administrateur
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                disabled={user.role === 'manager'} 
                                onClick={() => changeUserRole(user.id, 'manager')}
                              >
                                <UserCog className="h-4 w-4 mr-2" />
                                Gestionnaire
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                disabled={user.role === 'employee'} 
                                onClick={() => changeUserRole(user.id, 'employee')}
                              >
                                Employé
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  // Supprimer uniquement si ce n'est pas l'utilisateur actuel
                                  if (user.email !== 'admin@example.com') {
                                    setUsers(users.filter(u => u.id !== user.id));
                                    toast.success("Utilisateur supprimé avec succès");
                                  } else {
                                    toast.error("Impossible de supprimer l'utilisateur actuel");
                                  }
                                }}
                              >
                                <ShieldAlert className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
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

export default UsersPage;
