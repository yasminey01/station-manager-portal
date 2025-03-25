import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Download,
  FileSpreadsheet,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  ArrowUpDown,
  Package
} from 'lucide-react';

const salesData = [
  { name: 'Lun', SP95: 4000, SP98: 2400, Gazole: 5400 },
  { name: 'Mar', SP95: 3000, SP98: 1398, Gazole: 4200 },
  { name: 'Mer', SP95: 2000, SP98: 9800, Gazole: 6800 },
  { name: 'Jeu', SP95: 2780, SP98: 3908, Gazole: 5200 },
  { name: 'Ven', SP95: 5890, SP98: 4800, Gazole: 9800 },
  { name: 'Sam', SP95: 4390, SP98: 3800, Gazole: 8000 },
  { name: 'Dim', SP95: 3490, SP98: 4300, Gazole: 7000 },
];

const salesByPaymentMethod = [
  { name: 'Espèces', value: 45 },
  { name: 'Carte', value: 35 },
  { name: 'Virement', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Reports = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [reportType, setReportType] = useState('sales');
  const [stationFilter, setStationFilter] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      if (!dateRange.from || dateRange.to) {
        setDateRange({
          from: date,
          to: date,
        });
      } else {
        setDateRange({
          from: dateRange.from,
          to: dateRange.to,
        });
        setShowCalendar(false);
      }
    }
  };

  const getFormattedDateRange = () => {
    return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
  };

  const generateRandomReportData = () => {
    const report = {
      period: getFormattedDateRange(),
      totalSales: Math.floor(Math.random() * 50000) + 10000,
      stationPerformance: [
        { name: 'Station 1', sales: Math.floor(Math.random() * 15000) + 5000 },
        { name: 'Station 2', sales: Math.floor(Math.random() * 15000) + 5000 },
        { name: 'Station 3', sales: Math.floor(Math.random() * 15000) + 5000 },
      ],
      fuelTypes: {
        SP95: Math.floor(Math.random() * 20000) + 5000,
        SP98: Math.floor(Math.random() * 15000) + 3000,
        Gazole: Math.floor(Math.random() * 30000) + 10000,
      },
      paymentMethods: {
        Espèces: Math.floor(Math.random() * 30) + 20,
        Carte: Math.floor(Math.random() * 40) + 30,
        Virement: Math.floor(Math.random() * 20) + 10,
      }
    };
    
    return report;
  };

  const generatePDF = () => {
    const reportData = generateRandomReportData();
    console.log("Génération d'un rapport PDF avec les données:", reportData);
    
    setTimeout(() => {
      const content = `
        Rapport de ${reportType === 'sales' ? 'Ventes' : reportType === 'inventory' ? 'Inventaire' : 'Performances'}
        Période: ${reportData.period}
        Total des ventes: ${reportData.totalSales} DH
        
        Performances par station:
        - ${reportData.stationPerformance[0].name}: ${reportData.stationPerformance[0].sales} DH
        - ${reportData.stationPerformance[1].name}: ${reportData.stationPerformance[1].sales} DH
        - ${reportData.stationPerformance[2].name}: ${reportData.stationPerformance[2].sales} DH
        
        Ventes par type de carburant:
        - SP95: ${reportData.fuelTypes.SP95} DH
        - SP98: ${reportData.fuelTypes.SP98} DH
        - Gazole: ${reportData.fuelTypes.Gazole} DH
        
        Répartition par méthode de paiement:
        - Espèces: ${reportData.paymentMethods.Espèces}%
        - Carte: ${reportData.paymentMethods.Carte}%
        - Virement: ${reportData.paymentMethods.Virement}%
      `;
      
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rapport_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Rapport PDF téléchargé avec succès');
    }, 1000);
  };

  const generateExcel = () => {
    const reportData = generateRandomReportData();
    console.log("Génération d'un rapport Excel avec les données:", reportData);
    
    setTimeout(() => {
      const headers = "Type,Valeur\n";
      const rows = [
        `"Total des ventes","${reportData.totalSales} DH"`,
        `"Station 1","${reportData.stationPerformance[0].sales} DH"`,
        `"Station 2","${reportData.stationPerformance[1].sales} DH"`,
        `"Station 3","${reportData.stationPerformance[2].sales} DH"`,
        `"SP95","${reportData.fuelTypes.SP95} DH"`,
        `"SP98","${reportData.fuelTypes.SP98} DH"`,
        `"Gazole","${reportData.fuelTypes.Gazole} DH"`,
        `"Espèces","${reportData.paymentMethods.Espèces}%"`,
        `"Carte","${reportData.paymentMethods.Carte}%"`,
        `"Virement","${reportData.paymentMethods.Virement}%"`
      ].join("\n");
      
      const content = headers + rows;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rapport_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Rapport Excel téléchargé avec succès');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
        <p className="text-muted-foreground mt-2">
          Visualisez et exportez des rapports détaillés sur l'activité de vos stations
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'PPP', { locale: fr })} -{' '}
                      {format(dateRange.to, 'PPP', { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, 'PPP', { locale: fr })
                  )
                ) : (
                  <span>Choisir une période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setShowCalendar(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={stationFilter}
            onValueChange={setStationFilter}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Toutes les stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les stations</SelectItem>
              <SelectItem value="1">Station Marrakech</SelectItem>
              <SelectItem value="2">Station Casablanca</SelectItem>
              <SelectItem value="3">Station Rabat</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Rapport de ventes
                </div>
              </SelectItem>
              <SelectItem value="inventory">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Rapport d'inventaire
                </div>
              </SelectItem>
              <SelectItem value="performance">
                <div className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4" />
                  Performances
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={generatePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter en PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={generateExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter en Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="charts">
            <BarChart3 className="h-4 w-4 mr-2" />
            Graphiques
          </TabsTrigger>
          <TabsTrigger value="tables">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Tableaux
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventes par type de carburant</CardTitle>
                <CardDescription>
                  {getFormattedDateRange()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="SP95" fill="#8884d8" />
                      <Bar dataKey="SP98" fill="#82ca9d" />
                      <Bar dataKey="Gazole" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition des paiements</CardTitle>
                <CardDescription>
                  {getFormattedDateRange()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByPaymentMethod}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesByPaymentMethod.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Détails des ventes</CardTitle>
              <CardDescription>
                {getFormattedDateRange()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Station</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantité (L)</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Montant (DH)</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {[...Array(10)].map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4 align-middle">{format(subDays(new Date(), index), 'dd/MM/yyyy')}</td>
                        <td className="p-4 align-middle">Station {Math.floor(Math.random() * 3) + 1}</td>
                        <td className="p-4 align-middle">
                          {['SP95', 'SP98', 'Gazole'][Math.floor(Math.random() * 3)]}
                        </td>
                        <td className="p-4 align-middle text-right">{(Math.random() * 100 + 10).toFixed(2)}</td>
                        <td className="p-4 align-middle text-right">{(Math.random() * 1000 + 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t bg-muted/50 font-medium">
                    <tr>
                      <td colSpan={3} className="p-4">Total</td>
                      <td className="p-4 text-right">1325.75</td>
                      <td className="p-4 text-right">15482.50</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={generateExcel} className="mr-2">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exporter le tableau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
