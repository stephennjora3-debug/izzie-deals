import fs from 'fs';
import path from 'path';

console.log(' Fixing PDF download with better error handling...\n');

// 1. Update the DownloadPDFButton component
const pdfButtonPath = path.join('src', 'components', 'ui', 'DownloadPDFButton.tsx');

const pdfButtonCode = `'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function DownloadPDFButton({ orderId }: { orderId?: string }) {
  const handleDownload = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) {
      console.error('Receipt element not found');
      alert('Could not find receipt to download.');
      return;
    }

    try {
      // Show loading state
      const btn = document.getElementById('pdf-btn');
      if (btn) {
        btn.textContent = 'Generating...';
        btn.disabled = true;
      }

      // Wait a moment for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture the receipt element
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: true, // Better text rendering
        imageTimeout: 0 // No timeout for images
      });
      
      const imgData = canvas.toDataURL('image/png', { quality: 1.0 });
      
      // Create PDF - use a smaller page size to match receipt
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Generate filename with order ID
      const filename = orderId 
        ? \`aura-receipt-\${orderId.slice(0, 8)}.pdf\`
        : 'aura-commerce-receipt.pdf';
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback: Use browser print
      alert('Using browser print dialog instead. Select "Save as PDF" in the print options.');
      window.print();
    } finally {
      // Reset button
      const btn = document.getElementById('pdf-btn');
      if (btn) {
        btn.textContent = 'Download PDF';
        btn.disabled = false;
      }
    }
  };

  return (
    <button 
      id="pdf-btn"
      onClick={handleDownload}
      className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors flex items-center gap-2 disabled:opacity-50"
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
console.log('✅ Updated DownloadPDFButton with better error handling.');

// 2. Update the Receipt Page to pass orderId to the button
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');

  // Update the button usage to pass orderId
  if (code.includes('<DownloadPDFButton />')) {
    code = code.replace(
      '<DownloadPDFButton />',
      '<DownloadPDFButton orderId={order.id} />'
    );
    console.log('✅ Updated receipt to pass orderId to PDF button.');
  }

  fs.writeFileSync(receiptPath, code, 'utf8');
}

console.log('\\n🎉 PDF download fixed with better error handling!');