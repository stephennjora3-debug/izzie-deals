import fs from 'fs';
import path from 'path';

// 1. Create Cloudinary Config
const libDir = path.join('src', 'lib');
const cloudinaryConfigPath = path.join(libDir, 'cloudinary.ts');

const configContent = `import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
`;

fs.mkdirSync(libDir, { recursive: true });
fs.writeFileSync(cloudinaryConfigPath, configContent, 'utf8');
console.log('1. Created src/lib/cloudinary.ts');

// 2. Create Upload API Route
const apiDir = path.join('src', 'app', 'api', 'upload');
const routePath = path.join(apiDir, 'route.ts');

const routeContent = `import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'aura-commerce', // Organize images in a folder
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
`;

fs.mkdirSync(apiDir, { recursive: true });
fs.writeFileSync(routePath, routeContent, 'utf8');
console.log('2. Created src/app/api/upload/route.ts');