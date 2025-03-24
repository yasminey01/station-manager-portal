
// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
}

// Station types
export interface Station {
  idStation: number;
  nomStation: string;
  adresseStation: string;
  villeStation: string;
  dateMiseEnService: string;
  latitude: number;
  longitude: number;
  telephone: string;
  email: string;
  horairesOuverture: string;
  statut: 'actif' | 'inactif';
}

// Employee types
export interface Employee {
  idEmployee: number;
  idCard: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: 'homme' | 'femme';
  birthDate: string;
  address: string;
  nationality: string;
  cnssNumber: string;
  salary: number;
  contractType: string;
  status: string;
}

// Schedule types
export interface Schedule {
  idSchedule: number;
  idEmployee: number;
  idStation: number;
  week: number;
  day: number;
  startTime: string;
  endTime: string;
}

// Service types
export interface Service {
  idService: number;
  nomService: string;
  description: string;
  horaires: string;
}

// Pump types
export interface Pump {
  idPompe: number;
  nomPompe: string;
  statut: string;
  debit: number;
}

// Tank types
export interface Tank {
  idCiterne: number;
  capacite: number;
  dateInstallation: string;
  typeCarburant: string;
  statut: string;
}

// Supplier types
export interface Supplier {
  idFournisseur: number;
  nomFournisseur: string;
  adresseFournisseur: string;
  telephoneFournisseur: string;
  emailFournisseur: string;
  typeFournisseur: string;
  contactFournisseur: string;
}

// Product types
export interface Product {
  idProduct: number;
  nomProduit: string;
  type: string;
  date_ajout: string;
  unite: string;
}

// Stock types
export interface Stock {
  idEntree: number;
  dateEntree: string;
  quantite: number;
  prixAchat: number;
}

// Fuel verification types
export interface FuelVerification {
  idVerificationCarburant: number;
  compteurDebut: number;
  compteurFin: number;
}

// Sales types
export interface Sale {
  idVente: number;
  quantiteVente: number;
  dateVente: string;
  modePaiement: string;
}

// Pricing types
export interface Pricing {
  idIndexation: number;
  dateDebut: string;
  dateFin: string;
  prixVentePar: number;
}

// Dashboard stats
export interface DashboardStats {
  totalStations: number;
  activeStations: number;
  totalEmployees: number;
  totalSales: number;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
