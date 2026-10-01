'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Plus } from 'lucide-react';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls = [...value]; // Keep existing images

    try {
      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      }
      onChange(newUrls);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Display Uploaded Images */}
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-brand-100 border border-brand-200 group">
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              fill
              className="object-contain p-2"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 bg-brand-900 text-white text-[10px] px-2 py-0.5 rounded">
                Main
              </span>
            )}
          </div>
        ))}

        {/* "Add More" Button - Always Visible */}
        <div 
          className="aspect-square rounded-lg border-2 border-dashed border-brand-300 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer bg-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-brand-100 p-3 rounded-full mb-2">
            <Plus className="h-6 w-6 text-brand-600" />
          </div>
          <p className="text-xs font-medium text-brand-700">
            {value.length === 0 ? 'Upload Images' : 'Add More'}
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      
      {isUploading && (
        <p className="text-sm text-brand-600 text-center animate-pulse">Uploading images...</p>
      )}
    </div>
  );
}
