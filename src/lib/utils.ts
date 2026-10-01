export function formatCurrency(amount: number | string | null | undefined, currency: string = 'KES'): string {
  const numValue = Number(amount);
  if (isNaN(numValue)) {
    return 'KSh 0.00';
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numValue);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
