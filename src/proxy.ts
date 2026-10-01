import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_EMAILS = [
  'gitongab210@gmail.com',
  'stephennjora3@gmail.com',
  'njorastephen1@gmail.com'
];

export async function proxy(request: NextRequest) {
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
