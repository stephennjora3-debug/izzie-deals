import { createAdminClient } from '@/lib/supabase/admin';

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
