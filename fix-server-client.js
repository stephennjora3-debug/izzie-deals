import fs from 'fs';
import path from 'path';

const serverClientPath = path.join('src', 'lib', 'supabase', 'server.ts');

const serverClientContent = `import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
`;

fs.mkdirSync(path.dirname(serverClientPath), { recursive: true });
fs.writeFileSync(serverClientPath, serverClientContent, 'utf8');
console.log('✅ Fixed src/lib/supabase/server.ts to correctly export createClient.');