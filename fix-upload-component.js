import fs from 'fs';
import path from 'path';

const dirPath = path.join('src', 'components', 'ui');
const filePath = path.join(dirPath, 'ImageUpload.tsx');

const componentContent = `'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from './Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-brand-100">
          <Image
            src={value}
            alt="Upload preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-brand-300 rounded-lg p-12 text-center hover:border-brand-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-brand-400 mb-4" />
          <p className="text-sm text-brand-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-brand-400">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      
      {isUploading && (
        <p className="text-sm text-brand-600 text-center">Uploading...</p>
      )}
    </div>
  );
}
`;

fs.mkdirSync(dirPath, { recursive: true });
fs.writeFileSync(filePath, componentContent, 'utf8');
console.log('3. Created src/components/ui/ImageUpload.tsx');