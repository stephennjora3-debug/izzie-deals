import fs from 'fs';
import path from 'path';

console.log('🔧 Adding Download as PDF functionality...\n');

// 1. Create the DownloadPDFButton component
const pdfButtonDir = path.join('src', 'components', 'ui');
fs.mkdirSync(pdfButtonDir, { recursive: true });
const pdfButtonPath = path.join(pdfButtonDir, 'DownloadPDFButton.tsx');

const pdfButtonCode = `'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function DownloadPDFButton() {
  const handleDownload = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) {
      alert('Could not find receipt to download.');
      return;
    }

    try {
      // Capture the receipt element as a high-quality canvas
      const canvas = await html2canvas(element, { 
        scale: 2, // Higher scale for better text clarity
        useCORS: true, // Allow loading the QR code image
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create a new PDF (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save the PDF
      pdf.save('aura-commerce-receipt.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try using the Print button and "Save as PDF" instead.');
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PDF
    </button>
  );
}
`;

fs.writeFileSync(pdfButtonPath, pdfButtonCode, 'utf8');
console.log('✅ Created DownloadPDFButton component.');

// 2. Update the Receipt Page to include the button and the target ID
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');

  // Add import
  if (!code.includes("import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';")) {
    code = "import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';\n" + code;
  }

  // Add id="receipt-content" to the main receipt container
  if (!code.includes('id="receipt-content"')) {
    code = code.replace(
      '<div className="bg-white p-6 shadow-sm print:shadow-none font-mono text-xs text-gray-900 uppercase leading-tight">',
      '<div id="receipt-content" className="bg-white p-6 shadow-sm print:shadow-none font-mono text-xs text-gray-900 uppercase leading-tight">'
    );
  }

  // Add the Download button next to the Print button
  if (!code.includes('<DownloadPDFButton />')) {
    code = code.replace(
      '<PrintButton />',
      `<div className="flex gap-2">
            <DownloadPDFButton />
            <PrintButton />
          </div>`
    );
  }

  fs.writeFileSync(receiptPath, code, 'utf8');
  console.log('✅ Updated Receipt page with Download PDF button and target ID.');
} else {
  console.log('⚠️ Could not find receipt page.');
}

console.log('\n🎉 PDF Download functionality added!');