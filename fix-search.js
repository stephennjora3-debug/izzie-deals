import fs from 'fs';
import path from 'path';

console.log('Starting search fixes...');

// 1. Fix product.service.ts (The database query)
const servicePath = path.join('src', 'services', 'product.service.ts');
if (fs.existsSync(servicePath)) {
  let c = fs.readFileSync(servicePath, 'utf8');

  // Update function signature to accept searchQuery
  c = c.replace(
    'export async function getActiveProducts(): Promise<Product[]>',
    'export async function getActiveProducts(searchQuery?: string): Promise<Product[]>'
  );

  // Add the .modify() block to filter by name
  const oldEq = `.eq('status', 'active')`;
  // Note the backslashes before the dollar signs so Node doesn't crash!
  const newEq = `.eq('status', 'active')
    .modify((query) => {
      if (searchQuery) {
        query.ilike('name', \`%\${searchQuery}%\`);
      }
    })`;

  if (c.includes(oldEq)) {
    c = c.replace(oldEq, newEq);
    console.log('1. Updated product.service.ts to filter by search query.');
  }
  fs.writeFileSync(servicePath, c, 'utf8');
}

// 2. Fix Header.tsx (Wrap input in a form)
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
if (fs.existsSync(headerPath)) {
  let c = fs.readFileSync(headerPath, 'utf8');

  // Find the div containing the search input
  const inputRegex = /<div className="relative hidden md:block">([\s\S]*?)<\/div>/;
  const match = c.match(inputRegex);

  if (match) {
    let innerContent = match[1];
    
    // Add value and onChange to the Input component
    innerContent = innerContent.replace(
      /<Input([\s\S]*?)\/>/,
      `<Input$1 value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />`
    );

    // Wrap it in a form
    const formWrapper = `<form onSubmit={handleSearch} className="relative hidden md:block">${innerContent}</form>`;
    c = c.replace(match[0], formWrapper);
    console.log('2. Wrapped Header search input in a form.');
  } else {
    console.log('Warning: Could not find exact search input block in Header.');
  }

  fs.writeFileSync(headerPath, c, 'utf8');
}

// 3. Fix shop/page.tsx (Pass the param to the service)
const shopPagePath = path.join('src', 'app', '(shop)', 'shop', 'page.tsx');
if (fs.existsSync(shopPagePath)) {
  let c = fs.readFileSync(shopPagePath, 'utf8');
  
  // Ensure it passes the search param
  if (c.includes('const products = await getActiveProducts();')) {
    c = c.replace('const products = await getActiveProducts();', 'const products = await getActiveProducts(resolvedParams.search);');
    console.log('3. Updated Shop page to pass search param.');
  }
  fs.writeFileSync(shopPagePath, c, 'utf8');
}

console.log('\nAll search fixes applied!');