import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Fuel, 
  Users, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Settings,
  ShoppingCart,
  Package,
  Truck,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

const SIDEBAR_LINKS = [
  {
    path: '/dashboard',
    label: 'Tableau de bord',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    path: '/stations',
    label: 'Stations',
    icon: <Fuel className="h-5 w-5" />
  },
  {
    path: '/employees',
    label: 'Employés',
    icon: <Users className="h-5 w-5" />
  },
  {
    path: '/schedules',
    label: 'Planification',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    path: '/pumps-and-tanks',
    label: 'Pompes & Citernes',
    icon: <Fuel className="h-5 w-5" />
  },
  {
    path: '/sales',
    label: 'Ventes',
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    path: '/products',
    label: 'Produits',
    icon: <Package className="h-5 w-5" />
  },
  {
    path: '/suppliers',
    label: 'Fournisseurs',
    icon: <Truck className="h-5 w-5" />
  },
  {
    path: '/stock-entries',
    label: 'Entrées de stock',
    icon: <Package className="h-5 w-5" />
  },
  {
    path: '/reports',
    label: 'Rapports',
    icon: <BarChart className="h-5 w-5" />
  }
];

const SidebarLink = ({ item, isMobile = false }: { item: typeof SIDEBAR_LINKS[0], isMobile?: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.path);
  
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/60 hover:text-foreground hover:bg-accent",
          isMobile && "w-full"
        )
      }
    >
      <span className={cn("transition-all", isActive ? "text-primary" : "text-foreground/60 group-hover:text-foreground")}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </NavLink>
  );
};

const MobileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">StationManager</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Fermer</span>
              </Button>
            </SheetClose>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-2">
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map((item) => (
              <SheetClose key={item.path} asChild>
                <SidebarLink item={item} isMobile />
              </SheetClose>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex md:w-64 lg:w-72 border-r flex-col h-screen sticky top-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-primary">StationManager</h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map((item) => (
              <SidebarLink key={item.path} item={item} />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <MobileMenu />
            <h1 className="text-lg font-semibold md:hidden">StationManager</h1>
          </div>
          
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="sr-only">Menu utilisateur</span>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
