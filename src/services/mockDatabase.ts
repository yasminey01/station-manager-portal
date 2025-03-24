import { Station, Employee, Schedule, Service, Tank, Pump, DashboardStats, Sale, Product, Supplier, StockEntry } from '@/types';

// Mock data for stations
export const stations: Station[] = [
  {
    idStation: 1,
    nomStation: 'Station Centrale',
    adresseStation: '123 Avenue de la République',
    villeStation: 'Casablanca',
    dateMiseEnService: '2018-05-15',
    latitude: 33.5731,
    longitude: -7.5898,
    telephone: '+212 522 123 456',
    email: 'centrale@stationmanager.com',
    horairesOuverture: '06:00-22:00',
    statut: 'actif'
  },
  {
    idStation: 2,
    nomStation: 'Station Nord',
    adresseStation: '45 Rue Mohammed V',
    villeStation: 'Rabat',
    dateMiseEnService: '2019-08-22',
    latitude: 34.0209,
    longitude: -6.8416,
    telephone: '+212 537 789 123',
    email: 'nord@stationmanager.com',
    horairesOuverture: '24h/24',
    statut: 'actif'
  },
  {
    idStation: 3,
    nomStation: 'Station Sud',
    adresseStation: '78 Boulevard Hassan II',
    villeStation: 'Marrakech',
    dateMiseEnService: '2017-12-10',
    latitude: 31.6295,
    longitude: -7.9811,
    telephone: '+212 524 456 789',
    email: 'sud@stationmanager.com',
    horairesOuverture: '07:00-23:00',
    statut: 'inactif'
  },
  {
    idStation: 4,
    nomStation: 'Station Est',
    adresseStation: '12 Rue des Oliviers',
    villeStation: 'Fès',
    dateMiseEnService: '2020-03-05',
    latitude: 34.0181,
    longitude: -5.0078,
    telephone: '+212 535 321 654',
    email: 'est@stationmanager.com',
    horairesOuverture: '06:00-00:00',
    statut: 'actif'
  },
  {
    idStation: 5,
    nomStation: 'Station Ouest',
    adresseStation: '56 Avenue des FAR',
    villeStation: 'Tanger',
    dateMiseEnService: '2021-01-18',
    latitude: 35.7595,
    longitude: -5.8340,
    telephone: '+212 539 987 654',
    email: 'ouest@stationmanager.com',
    horairesOuverture: '05:30-23:30',
    statut: 'actif'
  }
];

// Mock data for employees
export const employees: Employee[] = [
  {
    idEmployee: 1,
    idCard: 'BK123456',
    firstName: 'Mohammed',
    lastName: 'Alaoui',
    phone: '+212 661 123 456',
    gender: 'homme',
    birthDate: '1985-04-12',
    address: '34 Rue Ibn Battouta, Casablanca',
    nationality: 'Marocaine',
    cnssNumber: 'CNSS123456',
    salary: 5200,
    contractType: 'CDI',
    status: 'actif'
  },
  {
    idEmployee: 2,
    idCard: 'BJ789012',
    firstName: 'Fatima',
    lastName: 'Benali',
    phone: '+212 662 345 678',
    gender: 'femme',
    birthDate: '1990-08-23',
    address: '15 Avenue Hassan II, Rabat',
    nationality: 'Marocaine',
    cnssNumber: 'CNSS789012',
    salary: 4800,
    contractType: 'CDI',
    status: 'actif'
  },
  {
    idEmployee: 3,
    idCard: 'BH345678',
    firstName: 'Youssef',
    lastName: 'El Khamlichi',
    phone: '+212 663 567 890',
    gender: 'homme',
    birthDate: '1992-11-05',
    address: '67 Boulevard Mohammed VI, Marrakech',
    nationality: 'Marocaine',
    cnssNumber: 'CNSS345678',
    salary: 4500,
    contractType: 'CDD',
    status: 'actif'
  },
  {
    idEmployee: 4,
    idCard: 'BL901234',
    firstName: 'Nadia',
    lastName: 'Tahiri',
    phone: '+212 664 789 012',
    gender: 'femme',
    birthDate: '1988-06-17',
    address: '23 Rue Allal Ben Abdellah, Fès',
    nationality: 'Marocaine',
    cnssNumber: 'CNSS901234',
    salary: 5000,
    contractType: 'CDI',
    status: 'inactif'
  },
  {
    idEmployee: 5,
    idCard: 'BE567890',
    firstName: 'Karim',
    lastName: 'Ziani',
    phone: '+212 665 901 234',
    gender: 'homme',
    birthDate: '1995-02-28',
    address: '89 Avenue Mohammed V, Tanger',
    nationality: 'Marocaine',
    cnssNumber: 'CNSS567890',
    salary: 4200,
    contractType: 'CDD',
    status: 'actif'
  }
];

// Mock data for schedules
export const schedules: Schedule[] = [
  {
    idSchedule: 1,
    idEmployee: 1,
    idStation: 1,
    week: 35,
    day: 1,
    startTime: '08:00',
    endTime: '16:00'
  },
  {
    idSchedule: 2,
    idEmployee: 1,
    idStation: 1,
    week: 35,
    day: 2,
    startTime: '08:00',
    endTime: '16:00'
  },
  {
    idSchedule: 3,
    idEmployee: 1,
    idStation: 1,
    week: 35,
    day: 3,
    startTime: '08:00',
    endTime: '16:00'
  },
  {
    idSchedule: 4,
    idEmployee: 2,
    idStation: 2,
    week: 35,
    day: 1,
    startTime: '16:00',
    endTime: '00:00'
  },
  {
    idSchedule: 5,
    idEmployee: 2,
    idStation: 2,
    week: 35,
    day: 2,
    startTime: '16:00',
    endTime: '00:00'
  },
  {
    idSchedule: 6,
    idEmployee: 3,
    idStation: 3,
    week: 35,
    day: 4,
    startTime: '08:00',
    endTime: '16:00'
  },
  {
    idSchedule: 7,
    idEmployee: 3,
    idStation: 3,
    week: 35,
    day: 5,
    startTime: '08:00',
    endTime: '16:00'
  },
  {
    idSchedule: 8,
    idEmployee: 4,
    idStation: 4,
    week: 35,
    day: 1,
    startTime: '00:00',
    endTime: '08:00'
  },
  {
    idSchedule: 9,
    idEmployee: 5,
    idStation: 5,
    week: 35,
    day: 3,
    startTime: '16:00',
    endTime: '00:00'
  },
  {
    idSchedule: 10,
    idEmployee: 5,
    idStation: 5,
    week: 35,
    day: 4,
    startTime: '16:00',
    endTime: '00:00'
  }
];

// Mock data for services
export const services: Service[] = [
  {
    idService: 1,
    nomService: 'Lavage Auto',
    description: 'Service de lavage automobile complet',
    horaires: '08:00-20:00'
  },
  {
    idService: 2,
    nomService: 'Vidange',
    description: 'Service de vidange et changement d\'huile',
    horaires: '08:00-18:00'
  },
  {
    idService: 3,
    nomService: 'Café',
    description: 'Café et restauration rapide',
    horaires: '24h/24'
  },
  {
    idService: 4,
    nomService: 'Boutique',
    description: 'Boutique de produits divers',
    horaires: '06:00-22:00'
  },
  {
    idService: 5,
    nomService: 'Gonflage Pneus',
    description: 'Service de gonflage de pneus',
    horaires: '24h/24'
  }
];

// Mock data for pumps
export const pumps: Pump[] = [
  {
    idPompe: 1,
    nomPompe: 'P1-Essence',
    numero: 1,
    statut: 'actif',
    debit: 40,
    idStation: 1
  },
  {
    idPompe: 2,
    nomPompe: 'P2-Diesel',
    numero: 2,
    statut: 'actif',
    debit: 45,
    idStation: 1
  },
  {
    idPompe: 3,
    nomPompe: 'P3-Sans Plomb',
    numero: 1,
    statut: 'inactif',
    debit: 38,
    idStation: 2
  },
  {
    idPompe: 4,
    nomPompe: 'P4-Diesel Premium',
    numero: 1,
    statut: 'actif',
    debit: 42,
    idStation: 3
  },
  {
    idPompe: 5,
    nomPompe: 'P5-Essence',
    numero: 1,
    statut: 'actif',
    debit: 40,
    idStation: 4
  }
];

// Mock data for tanks
export const tanks: Tank[] = [
  {
    idCiterne: 1,
    capacite: 20000,
    dateInstallation: '2018-05-10',
    typeCarburant: 'Essence',
    statut: 'actif',
    idStation: 1,
    niveauActuel: 15000
  },
  {
    idCiterne: 2,
    capacite: 25000,
    dateInstallation: '2018-05-10',
    typeCarburant: 'Diesel',
    statut: 'actif',
    idStation: 1,
    niveauActuel: 20000
  },
  {
    idCiterne: 3,
    capacite: 15000,
    dateInstallation: '2019-03-15',
    typeCarburant: 'Sans Plomb',
    statut: 'actif',
    idStation: 2,
    niveauActuel: 5000
  },
  {
    idCiterne: 4,
    capacite: 20000,
    dateInstallation: '2020-01-20',
    typeCarburant: 'Diesel Premium',
    statut: 'actif',
    idStation: 3,
    niveauActuel: 12000
  },
  {
    idCiterne: 5,
    capacite: 10000,
    dateInstallation: '2021-02-05',
    typeCarburant: 'Essence',
    statut: 'maintenance',
    idStation: 4,
    niveauActuel: 2000
  }
];

// Mock data for sales
export const sales: Sale[] = [
  {
    idVente: 1,
    idPompe: 1,
    idEmployee: 1,
    quantiteVente: 45.5,
    dateVente: '2023-09-10T08:15:00',
    modePaiement: 'Espèces',
    montant: 675.4
  },
  {
    idVente: 2,
    idPompe: 2,
    idEmployee: 2,
    quantiteVente: 30.0,
    dateVente: '2023-09-10T10:25:00',
    modePaiement: 'Carte',
    montant: 444.0
  },
  {
    idVente: 3,
    idPompe: 3,
    idEmployee: 3,
    quantiteVente: 60.0,
    dateVente: '2023-09-11T14:05:00',
    modePaiement: 'Virement',
    montant: 888.0
  },
  {
    idVente: 4,
    idPompe: 4,
    idEmployee: 4,
    quantiteVente: 25.5,
    dateVente: '2023-09-12T16:45:00',
    modePaiement: 'Espèces',
    montant: 377.4
  },
  {
    idVente: 5,
    idPompe: 5,
    idEmployee: 5,
    quantiteVente: 40.0,
    dateVente: '2023-09-13T12:30:00',
    modePaiement: 'Carte',
    montant: 592.0
  }
];

// Mock data for products
export const products: Product[] = [
  {
    idProduct: 1,
    nomProduit: 'Essence Sans Plomb 95',
    type: 'Carburant',
    date_ajout: '2022-01-15',
    unite: 'Litre'
  },
  {
    idProduct: 2,
    nomProduit: 'Diesel Premium',
    type: 'Carburant',
    date_ajout: '2022-01-15',
    unite: 'Litre'
  },
  {
    idProduct: 3,
    nomProduit: 'Huile Moteur 10W40',
    type: 'Lubrifiant',
    date_ajout: '2022-02-20',
    unite: 'Litre'
  },
  {
    idProduct: 4,
    nomProduit: 'Lave-glace',
    type: 'Accessoire',
    date_ajout: '2022-03-10',
    unite: 'Litre'
  },
  {
    idProduct: 5,
    nomProduit: 'Additif Carburant',
    type: 'Accessoire',
    date_ajout: '2022-04-05',
    unite: 'Pièce'
  }
];

// Mock data for stock entries
export const stockEntries: StockEntry[] = [
  {
    idEntree: 1,
    idProduct: 1,
    idFournisseur: 1,
    dateEntree: '2023-08-10',
    quantite: 5000,
    prixAchat: 10.5
  },
  {
    idEntree: 2,
    idProduct: 2,
    idFournisseur: 1,
    dateEntree: '2023-08-10',
    quantite: 5000,
    prixAchat: 11.2
  },
  {
    idEntree: 3,
    idProduct: 3,
    idFournisseur: 2,
    dateEntree: '2023-08-15',
    quantite: 200,
    prixAchat: 25.0
  },
  {
    idEntree: 4,
    idProduct: 4,
    idFournisseur: 3,
    dateEntree: '2023-08-20',
    quantite: 300,
    prixAchat: 5.5
  },
  {
    idEntree: 5,
    idProduct: 5,
    idFournisseur: 3,
    dateEntree: '2023-08-25',
    quantite: 150,
    prixAchat: 8.0
  }
];

// Mock data for suppliers
export const suppliers: Supplier[] = [
  {
    idFournisseur: 1,
    nomFournisseur: 'PétroMaroc',
    adresseFournisseur: '123 Avenue Hassan II, Casablanca',
    telephoneFournisseur: '+212 522 123 456',
    emailFournisseur: 'contact@petromaroc.ma',
    typeFournisseur: 'Carburant',
    contactFournisseur: 'Mohammed Alami'
  },
  {
    idFournisseur: 2,
    nomFournisseur: 'LubriTech',
    adresseFournisseur: '45 Rue Mohammed V, Rabat',
    telephoneFournisseur: '+212 537 456 789',
    emailFournisseur: 'info@lubritech.ma',
    typeFournisseur: 'Lubrifiant',
    contactFournisseur: 'Fatima Benali'
  },
  {
    idFournisseur: 3,
    nomFournisseur: 'AutoAccessoires',
    adresseFournisseur: '78 Boulevard Zerktouni, Marrakech',
    telephoneFournisseur: '+212 524 789 123',
    emailFournisseur: 'ventes@autoaccessoires.ma',
    typeFournisseur: 'Accessoire',
    contactFournisseur: 'Ahmed Tazi'
  },
  {
    idFournisseur: 4,
    nomFournisseur: 'PiècesDétachées',
    adresseFournisseur: '12 Avenue Moulay Ismail, Tanger',
    telephoneFournisseur: '+212 539 234 567',
    emailFournisseur: 'service@piecesdetachees.ma',
    typeFournisseur: 'Pièce',
    contactFournisseur: 'Karim Zouaoui'
  },
  {
    idFournisseur: 5,
    nomFournisseur: 'GazMaroc',
    adresseFournisseur: '56 Rue Abdelmoumen, Fès',
    telephoneFournisseur: '+212 535 678 901',
    emailFournisseur: 'contact@gazmaroc.ma',
    typeFournisseur: 'Gaz',
    contactFournisseur: 'Leila Chaoui'
  }
];

// Dashboard stats
export const dashboardStats: DashboardStats = {
  totalStations: stations.length,
  activeStations: stations.filter(station => station.statut === 'actif').length,
  totalEmployees: employees.length,
  totalSales: 1245780
};

// Station to services mapping
export const stationServices: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [1, 3, 4, 5],
  3: [1, 2, 4],
  4: [1, 3, 5],
  5: [2, 3, 4, 5]
};

// Station to pumps mapping
export const stationPumps: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4],
  4: [5],
  5: [1, 3]
};

// Station to tanks mapping
export const stationTanks: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4],
  4: [5],
  5: [1, 3]
};

// Station to employees mapping
export const stationEmployees: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4],
  4: [5],
  5: [1, 3]
};

// Helper function to get services for a station
export const getServicesByStationId = (stationId: number): Service[] => {
  const serviceIds = stationServices[stationId] || [];
  return services.filter(service => serviceIds.includes(service.idService));
};

// Helper function to get pumps for a station
export const getPumpsByStationId = (stationId: number): Pump[] => {
  return pumps.filter(pump => pump.idStation === stationId);
};

// Helper function to get tanks for a station
export const getTanksByStationId = (stationId: number): Tank[] => {
  return tanks.filter(tank => tank.idStation === stationId);
};

// Helper function to get employees for a station
export const getEmployeesByStationId = (stationId: number): Employee[] => {
  const employeeIds = stationEmployees[stationId] || [];
  return employees.filter(employee => employeeIds.includes(employee.idEmployee));
};

// Helper function to get station by id
export const getStationById = (stationId: number): Station | undefined => {
  return stations.find(station => station.idStation === stationId);
};

// Helper function to get employee by id
export const getEmployeeById = (employeeId: number): Employee | undefined => {
  return employees.find(employee => employee.idEmployee === employeeId);
};

// Helper function to get schedules for a station
export const getSchedulesByStationId = (stationId: number): Schedule[] => {
  return schedules.filter(schedule => schedule.idStation === stationId);
};

// Helper function to get schedules for an employee
export const getSchedulesByEmployeeId = (employeeId: number): Schedule[] => {
  return schedules.filter(schedule => schedule.idEmployee === employeeId);
};

// Helper function to get pump by id
export const getPumpById = (pumpId: number): Pump | undefined => {
  return pumps.find(pump => pump.idPompe === pumpId);
};

// Helper function to get tank by id
export const getTankById = (tankId: number): Tank | undefined => {
  return tanks.find(tank => tank.idCiterne === tankId);
};

// Helper function to get sales by station id
export const getSalesByStationId = (stationId: number): Sale[] => {
  const stationPumps = pumps.filter(pump => pump.idStation === stationId);
  const pumpIds = stationPumps.map(pump => pump.idPompe);
  return sales.filter(sale => sale.idPompe && pumpIds.includes(sale.idPompe));
};

// Helper function to get sales by employee id
export const getSalesByEmployeeId = (employeeId: number): Sale[] => {
  return sales.filter(sale => sale.idEmployee === employeeId);
};

// Helper function to get sales by pump id
export const getSalesByPumpId = (pumpId: number): Sale[] => {
  return sales.filter(sale => sale.idPompe === pumpId);
};

// Helper function to get sale by id
export const getSaleById = (saleId: number): Sale | undefined => {
  return sales.find(sale => sale.idVente === saleId);
};

// Helper function to get product by id
export const getProductById = (productId: number): Product | undefined => {
  return products.find(product => product.idProduct === productId);
};

// Helper function to get supplier by id
export const getSupplierById = (supplierId: number): Supplier | undefined => {
  return suppliers.find(supplier => supplier.idFournisseur === supplierId);
};

// Helper function to get stock entries by product id
export const getStockEntriesByProductId = (productId: number): StockEntry[] => {
  return stockEntries.filter(entry => entry.idProduct === productId);
};

// Helper function to get stock entries by supplier id
export const getStockEntriesBySupplierID = (supplierId: number): StockEntry[] => {
  return stockEntries.filter(entry => entry.idFournisseur === supplierId);
};
