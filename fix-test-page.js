import fs from 'fs';
import path from 'path';

const dirPath = path.join('src', 'app', '(shop)', 'test-upload');
const filePath = path.join(dirPath, 'page.tsx');

const pageContent = `'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';

export default function TestUploadPage() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Test Cloudinary Upload</h1>
      
      <div className="space-y-6">
        <ImageUpload 
          value={imageUrl} 
          onChange={(url) => {
            setImageUrl(url);
            console.log('Uploaded URL:', url);
          }} 
          onRemove={() => setImageUrl('')} 
        />

        {imageUrl && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="font-semibold text-green-800 mb-2">Upload Successful!</p>
            <p className="text-sm text-green-700 break-all">{imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.mkdirSync(dirPath, { recursive: true });
fs.writeFileSync(filePath, pageContent, 'utf8');
console.log('4. Created test upload page at /test-upload');