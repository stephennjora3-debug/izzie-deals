import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'middleware.ts');

console.log('Checking file: ' + filePath + '\n');

// Read before writing: check if file exists to prevent accidental overwrites
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE ALREADY EXISTS. Current content:');
  console.log(content);
  console.log('\nStopping to prevent accidental overwrite. Please review the existing middleware.');
  process.exit(1);
} else {
  console.log('File does not exist. Creating new secure middleware...\n');
}

const newContent = `import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_EMAILS = [
  'gitongab210@gmail.com',
  'stephennjora3@gmail.com',
  'njorastephen1@gmail.com'
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes: Only allow specific admin emails
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isUserAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
    
    if (!isUserAdmin) {
      // Redirect non-admins to the shop page
      return NextResponse.redirect(new URL('/shop', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
`;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ SUCCESS: Created src/middleware.ts');
console.log('   Added ADMIN_EMAILS array with your 3 emails.');
console.log('   Added logic to redirect any non-admin user away from /admin routes to /shop.');