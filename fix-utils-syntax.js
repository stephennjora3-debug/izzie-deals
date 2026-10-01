import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing broken syntax in utils.ts...\n');

const utilsPath = path.join('src', 'lib', 'utils.ts');

if (fs.existsSync(utilsPath)) {
  let code = fs.readFileSync(utilsPath, 'utf8');

  // Replace the broken function signature and variable reference
  const brokenCode = `export function formatCurrency(amount: number, currency: string = 'KES', { minimumFractionDigits: 2 }): string {
  const numValue = value || 0;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',`;

  const fixedCode = `export function formatCurrency(amount: number | null | undefined, currency: string = 'KES'): string {
  const numValue = Number(amount) || 0;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',`;

  if (code.includes(brokenCode)) {
    code = code.replace(brokenCode, fixedCode);
    fs.writeFileSync(utilsPath, code, 'utf8');
    console.log('✅ Successfully fixed formatCurrency syntax.');
  } else {
    console.log('⚠️ Could not find exact broken code. Trying a broader fix...');
    // Fallback regex
    code = code.replace(
      /export function formatCurrency\(amount: number[^}]+\}\): string \{[\s\S]*?const numValue = [^;]+;/,
      `export function formatCurrency(amount: number | null | undefined, currency: string = 'KES'): string {
  const numValue = Number(amount) || 0;`
    );
    fs.writeFileSync(utilsPath, code, 'utf8');
    console.log('✅ Applied fallback syntax fix.');
  }
} else {
  console.log('❌ utils.ts not found.');
}

console.log('\n🎉 Syntax fixed!');