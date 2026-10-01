import fs from 'fs';
import path from 'path';

console.log('Setting up live search...');

// 1. Create the SearchInput Client Component
const searchInputPath = path.join('src', 'components', 'layout', 'SearchInput.tsx');
const searchInputContent = `'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only trigger search if 3 or more letters, or if cleared completely
      if (query.length >= 3 || query.length === 0) {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set('search', query);
        } else {
          params.delete('search');
        }
        // Update URL without full page reload
        router.replace(\`/shop?\${params.toString()}\`, { scroll: false });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
      <input
        type="search"
        placeholder="Search products..."
        className="flex h-10 w-64 rounded-md border border-brand-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white placeholder:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
`;

fs.mkdirSync(path.dirname(searchInputPath), { recursive: true });
fs.writeFileSync(searchInputPath, searchInputContent, 'utf8');
console.log('1. Created SearchInput.tsx component.');

// 2. Update Header.tsx to use the new component
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
if (fs.existsSync(headerPath)) {
  let c = fs.readFileSync(headerPath, 'utf8');

  // Add import for SearchInput
  if (!c.includes("import { SearchInput } from './SearchInput';")) {
    c = c.replace(
      "import { CartBadge } from './CartBadge';", // Fallback if CartBadge exists
      "import { CartBadge } from './CartBadge';\nimport { SearchInput } from './SearchInput';"
    );
    // If CartBadge isn't there, just add it near the top
    if (!c.includes("import { SearchInput }")) {
       c = c.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { SearchInput } from './SearchInput';");
    }
  }

  // Replace the old form/search block with the new component
  // We look for the form tag we created earlier or the input itself
  const formRegex = /<form onSubmit=\{handleSearch\}[\s\S]*?<\/form>/;
  if (formRegex.test(c)) {
    c = c.replace(formRegex, '<SearchInput />');
    console.log('2. Replaced old search form with <SearchInput />.');
  } else {
    // Fallback: look for the input with placeholder
    const inputRegex = /<input[\s\S]*?placeholder="Search products\.\.\."[\s\S]*?\/>/;
    if (inputRegex.test(c)) {
       // Wrap it or replace it. Let's just replace the whole parent div if possible, 
       // but to be safe, let's just tell the user if this fails.
       console.log('Warning: Could not automatically replace the old search form. You may need to manually replace the search <form> in Header.tsx with <SearchInput />.');
    }
  }

  // Clean up unused search state/handler if they are still there
  c = c.replace(/const \[searchQuery, setSearchQuery\] = useState\(''\);[\s\S]*?const handleSearch = [\s\S]*?\};/g, '');
  c = c.replace(/const router = useRouter\(\);/g, ''); // Remove if not used elsewhere

  fs.writeFileSync(headerPath, c, 'utf8');
}

// 3. Verify product.service.ts is ready for the query
const servicePath = path.join('src', 'services', 'product.service.ts');
if (fs.existsSync(servicePath)) {
  let c = fs.readFileSync(servicePath, 'utf8');
  if (!c.includes('export async function getActiveProducts(searchQuery?: string)')) {
    c = c.replace(
      'export async function getActiveProducts(): Promise<Product[]>',
      'export async function getActiveProducts(searchQuery?: string): Promise<Product[]>'
    );
  }
  fs.writeFileSync(servicePath, c, 'utf8');
}

console.log('\nLive search setup complete!');