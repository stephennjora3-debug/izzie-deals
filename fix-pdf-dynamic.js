import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing "self is not defined" error with dynamic import...\n');

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
      btn.textContent = 'Generating...';
      btn.disabled = true;
    }

    try {
      // Dynamic import: Only loads the library when the button is clicked!
      const html2pdf = (await import('html2pdf.js')).default;

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      const opt = {
        margin: 0,
        filename: orderId ? \`aura-receipt-\${orderId.slice(0, 8)}.pdf\` : 'aura-receipt.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Using browser print dialog. Please select "Save as PDF" in the destination.');
      window.print();
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
console.log('✅ Fixed DownloadPDFButton to use dynamic import.');