import fs from 'fs';
import path from 'path';

console.log(' Fixing empty PDF issue with clone-and-capture method...\n');

const pdfButtonPath = path.join('src', 'components', 'ui', 'DownloadPDFButton.tsx');

const pdfButtonCode = `'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function DownloadPDFButton({ orderId }: { orderId?: string }) {
  const handleDownload = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) {
      alert('Could not find receipt to download.');
      return;
    }

    const btn = document.getElementById('pdf-btn');
    if (btn) {
      btn.textContent = 'Generating...';
      btn.disabled = true;
    }

    try {
      // 1. Clone the receipt element to isolate it from parent CSS
      const clone = element.cloneNode(true) as HTMLElement;
      
      // 2. Style the clone to be invisible but renderable
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.width = '380px';
      clone.style.background = 'white';
      clone.style.zIndex = '-1';
      clone.style.opacity = '0';
      clone.style.pointerEvents = 'none';
      
      document.body.appendChild(clone);

      // 3. Wait for images (QR code) to load in the clone
      const images = clone.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // 4. Small delay to ensure full rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 5. Capture the clone
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // 6. Remove the clone
      document.body.removeChild(clone);

      // 7. Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const filename = orderId 
        ? \`aura-receipt-\${orderId.slice(0, 8)}.pdf\`
        : 'aura-commerce-receipt.pdf';
      
      pdf.save(filename);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please use the Print button and select "Save as PDF".');
    } finally {
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
console.log('✅ Updated DownloadPDFButton with clone-and-capture method.');