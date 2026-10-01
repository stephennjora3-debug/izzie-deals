import fs from 'fs';
import path from 'path';

console.log('🔧 Switching to html2pdf.js for reliable downloads...\n');

// 1. Update the DownloadPDFButton component
const pdfButtonPath = path.join('src', 'components', 'ui', 'DownloadPDFButton.tsx');

const pdfButtonCode = `'use client';

import html2pdf from 'html2pdf.js';

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
          // Force background color
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate and save
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
console.log('✅ Updated DownloadPDFButton to use html2pdf.js.');

// 2. Ensure the receipt page has the correct ID and print styles
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');

  // Add print styles if not present
  if (!code.includes('@media print')) {
    const printStyle = `
      <style jsx global>{\`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      \`}</style>
    `;
    // Add before the closing </div> of the main container
    code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);/, printStyle + '\n    </div>\n    </div>\n    </div>\n  );');
    console.log('✅ Added print styles to receipt page.');
  }

  fs.writeFileSync(receiptPath, code, 'utf8');
}

console.log('\n PDF download fixed with html2pdf.js!');