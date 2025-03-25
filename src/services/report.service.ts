
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Add this import to make autoTable available
import * as XLSX from 'xlsx';
import { Sale, Employee, Station, Product, Supplier, StockEntry } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Type declaration to make TypeScript recognize autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    getNumberOfPages: () => number;
  }
}

export const reportService = {
  // Fonction pour générer un rapport PDF de ventes
  generateSalesPDF: (sales: Sale[], title: string = 'Rapport des ventes') => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Date du rapport
    doc.setFontSize(11);
    doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 14, 30);
    
    // Données pour le tableau
    const body = sales.map((sale, index) => [
      (index + 1).toString(),
      sale.saleDate ? format(new Date(sale.saleDate), 'dd/MM/yyyy', { locale: fr }) : 'N/A',
      sale.product?.name || 'N/A',
      sale.quantity?.toString() || '0',
      `${sale.unitPrice?.toFixed(2) || '0.00'} €`,
      `${sale.totalAmount?.toFixed(2) || '0.00'} €`,
      sale.customer || 'Client occasionnel',
      sale.employee?.name || 'N/A',
      sale.station?.name || 'N/A',
    ]);
    
    // Configuration du tableau
    doc.autoTable({
      startY: 40,
      head: [['#', 'Date', 'Produit', 'Quantité', 'Prix unitaire', 'Montant total', 'Client', 'Employé', 'Station']],
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      footStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    
    // Pagination
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} sur ${totalPages}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Retourner le document PDF
    return doc;
  },
  
  // Fonction pour générer un rapport Excel de ventes
  generateSalesExcel: (sales: Sale[], title: string = 'Rapport des ventes') => {
    // Données pour le tableau Excel
    const data = sales.map((sale, index) => ({
      '#': index + 1,
      'Date': sale.saleDate ? format(new Date(sale.saleDate), 'dd/MM/yyyy', { locale: fr }) : 'N/A',
      'Produit': sale.product?.name || 'N/A',
      'Quantité': sale.quantity || 0,
      'Prix unitaire': sale.unitPrice || 0,
      'Montant total': sale.totalAmount || 0,
      'Client': sale.customer || 'Client occasionnel',
      'Employé': sale.employee?.name || 'N/A',
      'Station': sale.station?.name || 'N/A',
    }));
    
    // Créer une feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Créer un classeur
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    
    // Retourner le classeur Excel
    return workbook;
  },
  
  // Autres fonctions pour générer des rapports pour d'autres entités
  generateEmployeesPDF: (employees: Employee[]) => {
    // Implémenter la génération de rapport PDF pour les employés
    const doc = new jsPDF();
    // ... logique similaire à generateSalesPDF
    return doc;
  },
  
  generateStationsPDF: (stations: Station[]) => {
    // Implémenter la génération de rapport PDF pour les stations
    const doc = new jsPDF();
    // ... logique similaire à generateSalesPDF
    return doc;
  },
  
  generateProductsPDF: (products: Product[]) => {
    // Implémenter la génération de rapport PDF pour les produits
    const doc = new jsPDF();
    // ... logique similaire à generateSalesPDF
    return doc;
  },
  
  generateSuppliersPDF: (suppliers: Supplier[]) => {
    // Implémenter la génération de rapport PDF pour les fournisseurs
    const doc = new jsPDF();
    // ... logique similaire à generateSalesPDF
    return doc;
  },
  
  generateStockEntriesPDF: (stockEntries: StockEntry[]) => {
    // Implémenter la génération de rapport PDF pour les entrées de stock
    const doc = new jsPDF();
    // ... logique similaire à generateSalesPDF
    return doc;
  },
  
  // Fonctions similaires pour générer des rapports Excel pour d'autres entités
  // ...
};

export default reportService;
