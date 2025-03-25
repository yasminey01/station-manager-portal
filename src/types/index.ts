
// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  telephone?: string;
  photoUrl?: string;
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
  email: string;
  gender: 'homme' | 'femme';
  birthDate: string;
  address: string;
  nationality: string;
  cnssNumber: string;
  salary: number;
  contractType: string;
  status: string;
  role?: 'employee';
  photoUrl?: string;
  isPresent?: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
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
  numero?: number;
  statut: string;
  debit: number;
  idStation?: number;
}

// Tank types
export interface Tank {
  idCiterne: number;
  capacite: number;
  dateInstallation: string;
  typeCarburant: string;
  statut: string;
  idStation?: number;
  niveauActuel?: number;
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
  idPompe?: number;
  idEmployee?: number;
  quantiteVente: number;
  dateVente: string;
  modePaiement: 'Espèces' | 'Carte' | 'Virement';
  montant?: number;
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

// Stock Entry types
export interface StockEntry {
  idEntree: number;
  idProduct: number;
  idFournisseur?: number;
  dateEntree: string;
  quantite: number;
  prixAchat: number;
}

// Attendance types
export interface Attendance {
  id: number;
  idEmployee: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'halfDay';
  comments?: string;
}

// System settings types
export interface SystemSettings {
  id: number;
  companyName: string;
  logo?: string;
  timezone: string;
  taxRate: number;
  currency: string;
  paymentMethods: ('Espèces' | 'Carte' | 'Virement')[];
  notifications: boolean;
  lastBackup?: string;
}
