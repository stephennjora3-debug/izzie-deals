import fs from 'fs';
import path from 'path';

console.log(' Creating a test endpoint to check raw database response...\n');

const routeDir = path.join('src', 'app', 'api', 'test-images');
fs.mkdirSync(routeDir, { recursive: true });

const routeCode = `import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient(); // Using admin to bypass any RLS issues
  
  // 1. Try the plural relationship
  const { data: dataPlural, error: errorPlural } = await supabase
    .from('products')
    .select('id, name, product_images (image_url, is_primary)')
    .limit(2);

  // 2. Try the singular relationship just in case
  const { data: dataSingular, error: errorSingular } = await supabase
    .from('products')
    .select('id, name, product_image (image_url, is_primary)')
    .limit(2);

  return Response.json({
    plural_result: dataPlural,
    plural_error: errorPlural?.message,
    singular_result: dataSingular,
    singular_error: errorSingular?.message
  });
}
`;

fs.writeFileSync(path.join(routeDir, 'route.ts'), routeCode, 'utf8');

console.log('✅ Created test endpoint.');
console.log('\n Next steps:');
console.log('1. Make sure your server is running (npm run dev)');
console.log('2. Go to: http://localhost:3000/api/test-images');
console.log('3. Copy the JSON output and paste it here.');
console.log('\nThis will tell us EXACTLY why the images are missing!');