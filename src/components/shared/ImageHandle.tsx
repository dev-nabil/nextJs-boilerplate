'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ImageHandleProps {
  imageUrl: string;
  alt?: string;
  defaultImageUrl?: string;
  className?: string;
}

const ImageHandle: React.FC<ImageHandleProps> = ({
  imageUrl,
  alt = 'image',
  defaultImageUrl = 'https://img.freepik.com/premium-vector/image-icon-design-vector-template_1309674-939.jpg',
  className,
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Create an off-screen image to check the load status immediately.
    const img = new Image();
    img.src = currentImageUrl;
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setCurrentImageUrl(defaultImageUrl);
      setLoading(false);
    };
  }, [currentImageUrl, defaultImageUrl]);

  useEffect(() => {
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  const handleError = () => {
    setCurrentImageUrl(defaultImageUrl);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center rounded-lg shadow-lg backdrop-blur-[100px] bg-white/[0] z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-loader animate-spin absolute z-20"
          >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
        </div>
      )}

      <img
        className={cn('object-cover', className)}
        src={currentImageUrl}
        alt={alt}
        onError={handleError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImageHandle;
