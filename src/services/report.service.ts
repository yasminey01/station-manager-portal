
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
      sale.dateVente ? format(new Date(sale.dateVente), 'dd/MM/yyyy', { locale: fr }) : 'N/A',
      // Since product is not directly available, use a placeholder
      'N/A', // Product name would go here
      sale.quantiteVente?.toString() || '0',
      // unitPrice is not available, so we calculate it if possible
      sale.montant && sale.quantiteVente ? `${(sale.montant / sale.quantiteVente).toFixed(2)} €` : '0.00 €',
      `${sale.montant?.toFixed(2) || '0.00'} €`,
      'Client occasionnel', // Customer info not available in the Sale type
      // Employee name not directly available, use a placeholder
      'N/A', // Employee name would go here
      // Station name not directly available, use a placeholder
      'N/A', // Station name would go here
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
      'Date': sale.dateVente ? format(new Date(sale.dateVente), 'dd/MM/yyyy', { locale: fr }) : 'N/A',
      'Produit': 'N/A', // Product name would go here
      'Quantité': sale.quantiteVente || 0,
      'Prix unitaire': sale.montant && sale.quantiteVente ? (sale.montant / sale.quantiteVente) : 0,
      'Montant total': sale.montant || 0,
      'Client': 'Client occasionnel', // Customer info not available
      'Employé': 'N/A', // Employee name would go here
      'Station': 'N/A', // Station name would go here
    }));
    
    // Créer une feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Créer un classeur
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    
    // Retourner le classeur Excel
    return workbook;
  },
  
  // Téléchargement de PDF
  downloadPDF: (doc: jsPDF, filename: string) => {
    try {
      doc.save(filename);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      throw error;
    }
  },
  
  // Téléchargement d'Excel
  downloadExcel: (workbook: XLSX.WorkBook, filename: string) => {
    try {
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier Excel:', error);
      throw error;
    }
  },
  
  // Fonctions pour générer des rapports pour d'autres entités
  generateEmployeesPDF: (employees: Employee[], title: string = 'Rapport des employés') => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Date du rapport
    doc.setFontSize(11);
    doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 14, 30);
    
    // Données pour le tableau
    const body = employees.map((employee, index) => [
      (index + 1).toString(),
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.phone || 'N/A',
      employee.role,
      employee.status,
    ]);
    
    // Configuration du tableau
    doc.autoTable({
      startY: 40,
      head: [['#', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut']],
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
    
    return doc;
  },
  
  // Utilisez le même modèle pour d'autres types de rapports
  generateStationsPDF: (stations: Station[]) => {
    const doc = new jsPDF();
    // ... Implémentation similaire à generateEmployeesPDF
    return doc;
  },
  
  generateProductsPDF: (products: Product[]) => {
    const doc = new jsPDF();
    // ... Implémentation similaire à generateEmployeesPDF
    return doc;
  },
  
  generateSuppliersPDF: (suppliers: Supplier[]) => {
    const doc = new jsPDF();
    // ... Implémentation similaire à generateEmployeesPDF
    return doc;
  },
  
  generateStockEntriesPDF: (stockEntries: StockEntry[]) => {
    const doc = new jsPDF();
    // ... Implémentation similaire à generateEmployeesPDF
    return doc;
  },
};

export default reportService;
