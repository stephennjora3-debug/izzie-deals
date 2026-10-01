import fs from 'fs';
import path from 'path';

const searchInputPath = path.join('src', 'components', 'layout', 'SearchInput.tsx');

const fixedSearchInput = `'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    // ONLY run this logic if we are currently on the /shop page
    if (pathname !== '/shop') return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query.length >= 3) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      
      const newUrl = \`/shop?\${params.toString()}\`;
      router.replace(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router, searchParams, pathname]);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
      <input
        type="search"
        placeholder="Search products..."
        className="flex h-10 w-64 rounded-md border border-brand-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white placeholder:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          // If user types on a non-shop page, redirect them to shop
          if (pathname !== '/shop' && e.target.value.length >= 3) {
            router.push(\`/shop?search=\${encodeURIComponent(e.target.value)}\`);
          }
        }}
      />
    </div>
  );
}
`;

fs.writeFileSync(searchInputPath, fixedSearchInput, 'utf8');
console.log('Fixed SearchInput to stop hijacking navigation!');