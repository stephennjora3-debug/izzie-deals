'use client';

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors"
    >
      Print Receipt
    </button>
  );
}
