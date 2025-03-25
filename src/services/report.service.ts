
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportData {
  title: string;
  period: string;
  totalSales?: number;
  stationPerformance?: Array<{name: string, sales: number}>;
  fuelTypes?: Record<string, number>;
  paymentMethods?: Record<string, number>;
  tableData?: Array<Record<string, any>>;
  tableHeaders?: string[];
}

export const reportService = {
  generatePDF: (data: ReportData): Blob => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Titre
    doc.setFontSize(20);
    doc.text(data.title, pageWidth / 2, 20, { align: 'center' });
    
    // Période
    doc.setFontSize(12);
    doc.text(`Période: ${data.period}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 40;
    
    // Total des ventes
    if (data.totalSales !== undefined) {
      doc.text(`Total des ventes: ${data.totalSales.toLocaleString('fr-FR')} DH`, 14, yPosition);
      yPosition += 10;
    }
    
    // Performances par station
    if (data.stationPerformance && data.stationPerformance.length > 0) {
      doc.text('Performances par station:', 14, yPosition);
      yPosition += 10;
      
      data.stationPerformance.forEach(station => {
        doc.text(`- ${station.name}: ${station.sales.toLocaleString('fr-FR')} DH`, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 4;
    }
    
    // Ventes par type de carburant
    if (data.fuelTypes) {
      doc.text('Ventes par type de carburant:', 14, yPosition);
      yPosition += 10;
      
      Object.entries(data.fuelTypes).forEach(([type, amount]) => {
        doc.text(`- ${type}: ${amount.toLocaleString('fr-FR')} DH`, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 4;
    }
    
    // Répartition par méthode de paiement
    if (data.paymentMethods) {
      doc.text('Répartition par méthode de paiement:', 14, yPosition);
      yPosition += 10;
      
      Object.entries(data.paymentMethods).forEach(([method, percentage]) => {
        doc.text(`- ${method}: ${percentage}%`, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 4;
    }
    
    // Tableau de données
    if (data.tableData && data.tableData.length > 0 && data.tableHeaders) {
      doc.autoTable({
        startY: yPosition,
        head: [data.tableHeaders],
        body: data.tableData.map(row => data.tableHeaders!.map(header => row[header] || '')),
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Rapport généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    return doc.output('blob');
  },
  
  generateExcel: (data: ReportData): Blob => {
    const workbook = XLSX.utils.book_new();
    
    // Créer une feuille pour les données principales
    const mainData = [
      ['Rapport', data.title],
      ['Période', data.period],
      ['Total des ventes', data.totalSales ? `${data.totalSales.toLocaleString('fr-FR')} DH` : '']
    ];
    
    // Ajouter les performances par station
    if (data.stationPerformance && data.stationPerformance.length > 0) {
      mainData.push(['', '']);
      mainData.push(['Performances par station', '']);
      data.stationPerformance.forEach(station => {
        mainData.push([station.name, `${station.sales.toLocaleString('fr-FR')} DH`]);
      });
    }
    
    // Ajouter les ventes par type de carburant
    if (data.fuelTypes) {
      mainData.push(['', '']);
      mainData.push(['Ventes par type de carburant', '']);
      Object.entries(data.fuelTypes).forEach(([type, amount]) => {
        mainData.push([type, `${amount.toLocaleString('fr-FR')} DH`]);
      });
    }
    
    // Ajouter la répartition par méthode de paiement
    if (data.paymentMethods) {
      mainData.push(['', '']);
      mainData.push(['Répartition par méthode de paiement', '']);
      Object.entries(data.paymentMethods).forEach(([method, percentage]) => {
        mainData.push([method, `${percentage}%`]);
      });
    }
    
    const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Résumé');
    
    // Créer une feuille pour les données du tableau
    if (data.tableData && data.tableData.length > 0 && data.tableHeaders) {
      const tableSheet = XLSX.utils.json_to_sheet(data.tableData);
      XLSX.utils.book_append_sheet(workbook, tableSheet, 'Données détaillées');
    }
    
    // Générer le fichier
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  },
  
  downloadFile: (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

export default reportService;
