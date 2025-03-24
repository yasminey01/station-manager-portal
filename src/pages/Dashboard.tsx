import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Fuel, 
  Users, 
  Wallet,
  TrendingUp,
  Building,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { dashboardStats, stations, tanks } from '@/services/mockDatabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Generate random sales data for chart
const generateSalesData = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months.map(month => ({
    name: month,
    ventes: Math.floor(Math.random() * 50000) + 30000
  }));
};

// Generate random revenue data per station
const generateRevenueData = () => {
  return stations.slice(0, 5).map(station => ({
    name: station.nomStation,
    revenue: Math.floor(Math.random() * 200000) + 100000
  }));
};

// Generate random fuel levels data
const generateFuelLevelsData = () => {
  return tanks.map(tank => ({
    name: tank.typeCarburant,
    level: Math.floor(Math.random() * 100)
  }));
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend = 0, 
  link = '' 
}: { 
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  link?: string;
}) => {
  const trendIndicator = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="mt-1 flex items-center text-sm">
            <span className={cn("flex items-center", trendIndicator)}>
              {trend !== 0 && (
                <>
                  <TrendingUp className={cn("mr-1 h-3 w-3", trend < 0 && "rotate-180")} />
                  {Math.abs(trend)}%
                </>
              )}
            </span>
            <span className="ml-1 text-muted-foreground">{description}</span>
          </div>
        )}
        {link && (
          <div className="mt-3">
            <Button variant="ghost" className="h-8 px-2 text-xs" asChild>
              <Link to={link}>
                <span>Voir plus</span>
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [fuelLevelsData, setFuelLevelsData] = useState<any[]>([]);
  
  useEffect(() => {
    setSalesData(generateSalesData());
    setRevenueData(generateRevenueData());
    setFuelLevelsData(generateFuelLevelsData());
  }, []);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue, {user?.firstName}! Voici un aperçu des performances et des statistiques.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Stations"
          value={dashboardStats.totalStations}
          description={`${dashboardStats.activeStations} actives`}
          icon={<Fuel className="h-4 w-4" />}
          trend={2.5}
          link="/stations"
        />
        <StatCard
          title="Employés"
          value={dashboardStats.totalEmployees}
          description="Total des employés"
          icon={<Users className="h-4 w-4" />}
          link="/employees"
        />
        <StatCard
          title="Ventes Mensuelles"
          value={`${Math.floor(dashboardStats.totalSales / 12).toLocaleString('fr-FR')} DH`}
          description="Mois actuel"
          icon={<Wallet className="h-4 w-4" />}
          trend={3.2}
        />
        <StatCard
          title="Stations Actives"
          value={`${(dashboardStats.activeStations / dashboardStats.totalStations * 100).toFixed(0)}%`}
          description="Taux d'activité"
          icon={<Building className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Ventes Annuelles</CardTitle>
            <CardDescription>Évolution des ventes sur l'année en cours</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toLocaleString('fr-FR')} DH`, 'Ventes']}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="ventes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Revenus par Station</CardTitle>
            <CardDescription>Top 5 des stations par revenu</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis 
                    type="number" 
                    stroke="#888888" 
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toLocaleString('fr-FR')} DH`, 'Revenu']}
                    labelFormatter={(label) => `Station: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Niveaux de Carburant
          </CardTitle>
          <CardDescription>Statut actuel des réservoirs de carburant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fuelLevelsData.map((fuel, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{fuel.name}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    fuel.level < 20 ? "text-red-500" : 
                    fuel.level < 50 ? "text-yellow-500" : 
                    "text-green-500"
                  )}>
                    {fuel.level}%
                  </span>
                </div>
                <Progress
                  value={fuel.level}
                  className={cn(
                    fuel.level < 20 ? "text-red-500" : 
                    fuel.level < 50 ? "text-yellow-500" : 
                    "text-green-500"
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
