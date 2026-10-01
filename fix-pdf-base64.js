import fs from 'fs';
import path from 'path';

console.log(' Fixing PDF download with Base64 image conversion...\n');

const pdfButtonPath = path.join('src', 'components', 'ui', 'DownloadPDFButton.tsx');

const pdfButtonCode = `'use client';

export function DownloadPDFButton({ orderId }: { orderId?: string }) {
  const handleDownload = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) {
      alert('Could not find receipt to download.');
      return;
    }

    const btn = document.getElementById('pdf-btn');
    if (btn) {
      btn.textContent = 'Preparing...';
      btn.disabled = true;
    }

    try {
      // 1. Fix CORS issue: Convert external QR image to Base64
      const qrImg = element.querySelector('img');
      if (qrImg && qrImg.src.startsWith('http')) {
        try {
          const response = await fetch(qrImg.src);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          qrImg.src = base64 as string; // Replace URL with base64 data
        } catch (e) {
          console.warn('Could not convert QR code to base64, proceeding anyway.');
        }
      }

      // 2. Dynamically import libraries only when needed
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // 3. Capture the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // 4. Generate PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const filename = orderId ? \`aura-receipt-\${orderId.slice(0, 8)}.pdf\` : 'aura-receipt.pdf';
      pdf.save(filename);

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Direct download failed. Please use the Print button and select "Save as PDF".');
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
console.log('✅ Updated DownloadPDFButton with Base64 fix.');