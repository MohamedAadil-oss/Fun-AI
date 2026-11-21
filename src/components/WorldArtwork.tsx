import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface WorldArtworkProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function WorldArtwork({ src, alt, title, className = '' }: WorldArtworkProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#131C2E] to-[#0B1120] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-8 h-8 text-[#F59E0B] mb-2" aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-[#F1F5F9]">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`block w-full h-full object-cover scale-[1.04] ${className}`}
    />
  );
}
