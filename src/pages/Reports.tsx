
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, FileText, BarChart as BarChartIcon, Calendar, Printer, PackageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { stations, sales, pumps, employees, tanks } from '@/services/mockDatabase';

// Generate mock sales data per month
const generateMonthlySalesData = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months.map(month => ({
    name: month,
    ventes: Math.floor(Math.random() * 200000) + 100000,
    volume: Math.floor(Math.random() * 15000) + 8000,
  }));
};

// Generate mock sales data per station
const generateSalesPerStationData = () => {
  return stations.map(station => ({
    name: station.nomStation,
    value: Math.floor(Math.random() * 300000) + 150000,
  }));
};

// Generate mock fuel type distribution data
const generateFuelTypeData = () => {
  return [
    { name: 'Essence', value: 45 },
    { name: 'Diesel', value: 40 },
    { name: 'Sans Plomb', value: 10 },
    { name: 'Premium', value: 5 },
  ];
};

// Generate mock employee performance data
const generateEmployeePerformanceData = () => {
  return employees.map(employee => ({
    name: `${employee.firstName} ${employee.lastName}`,
    ventes: Math.floor(Math.random() * 150) + 50,
    heures: Math.floor(Math.random() * 160) + 120,
  }));
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const ReportsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [periodRange, setPeriodRange] = useState('month');
  const [stationFilter, setStationFilter] = useState('all');
  
  const monthlySalesData = generateMonthlySalesData();
  const salesPerStationData = generateSalesPerStationData();
  const fuelTypeData = generateFuelTypeData();
  const employeePerformanceData = generateEmployeePerformanceData();

  const handleExportPDF = () => {
    // Implement PDF export
    alert('Exporter en PDF - Fonctionnalité à implémenter');
  };

  const handleExportExcel = () => {
    // Implement Excel export
    alert('Exporter en Excel - Fonctionnalité à implémenter');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports et Statistiques</h1>
          <p className="text-muted-foreground">
            Analyse des performances et des données commerciales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>
              Sélectionnez les critères pour les rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="report-type">Type de rapport</Label>
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                    <SelectItem value="employees">Employés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Select 
                  value={periodRange} 
                  onValueChange={setPeriodRange}
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Sélectionnez la période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Select 
                  value={stationFilter} 
                  onValueChange={setStationFilter}
                >
                  <SelectTrigger id="station">
                    <SelectValue placeholder="Sélectionnez la station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les stations</SelectItem>
                    {stations.map(station => (
                      <SelectItem key={station.idStation} value={station.idStation.toString()}>
                        {station.nomStation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {periodRange === 'custom' && (
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <Input
                    id="start-date"
                    type="date"
                    defaultValue={format(subMonths(new Date(), 1), 'yyyy-MM-dd')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Ventes
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <PackageIcon className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Employés
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes mensuelles</CardTitle>
                  <CardDescription>Évolution des ventes sur l'année</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySalesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="ventes" name="Ventes (DH)" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="volume" name="Volume (L)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventes par station</CardTitle>
                  <CardDescription>Répartition des ventes par station</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesPerStationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {salesPerStationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} DH`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type de carburant</CardTitle>
                <CardDescription>Pourcentage des ventes par type de carburant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fuelTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {fuelTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Niveau des citernes</CardTitle>
                <CardDescription>État actuel des réservoirs de carburant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={tanks.map(tank => ({
                        name: tank.typeCarburant,
                        capacite: tank.capacite,
                        niveau: tank.niveauActuel || 0,
                      }))}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="capacite" name="Capacité (L)" fill="#82ca9d" />
                      <Bar dataKey="niveau" name="Niveau actuel (L)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance des employés</CardTitle>
                <CardDescription>Ventes et heures travaillées par employé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeePerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="ventes" name="Ventes" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="heures" name="Heures travaillées" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
