import fs from 'fs';
import path from 'path';

const searchInputPath = path.join('src', 'components', 'layout', 'SearchInput.tsx');

const content = `'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Start empty to avoid useSearchParams Suspense issues in Next.js 15
  const [query, setQuery] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Only trigger search logic if we are on the shop page
    if (pathname !== '/shop') return;

    timerRef.current = setTimeout(() => {
      if (query.length >= 3) {
        router.push(\`/shop?search=\${encodeURIComponent(query)}\`, { scroll: false });
      } else if (query.length === 0) {
        // Clear search if input is empty
        router.push('/shop', { scroll: false });
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, pathname, router]);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
      <input
        type="search"
        placeholder="Search products..."
        className="flex h-10 w-64 rounded-md border border-brand-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white placeholder:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
`;

fs.writeFileSync(searchInputPath, content, 'utf8');
console.log('✅ Removed useSearchParams from SearchInput to fix Next.js 15 build error.');