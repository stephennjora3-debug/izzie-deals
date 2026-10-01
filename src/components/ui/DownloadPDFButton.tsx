'use client';

export function DownloadPDFButton() {
  const handlePrint = () => {
    // Trigger the browser's native print dialog
    // Users can select "Save as PDF" as the destination
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors flex items-center gap-2 no-print"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PDF
    </button>
  );
}
