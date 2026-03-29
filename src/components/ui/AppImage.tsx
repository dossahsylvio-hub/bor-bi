'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
}

export default function AppImage({
  src,
  alt,
  width = 150,
  height = 150,
  className = '',
  fallback = 'https://placehold.co/150x150/e5e7eb/9ca3af?text=Image',
  style,
}: AppImageProps) {
  const [imgSrc, setImgSrc] = React.useState(src || fallback);

  React.useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
      unoptimized={imgSrc.startsWith('https://placehold.co') || imgSrc.startsWith('data:')}
    />
  );
}