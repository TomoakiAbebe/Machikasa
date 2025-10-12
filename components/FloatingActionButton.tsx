'use client';

import Link from 'next/link';
import { Camera } from 'lucide-react';

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function FloatingActionButton({ 
  href = '/scan', 
  onClick, 
  className = '',
  children 
}: FloatingActionButtonProps) {
  const baseClasses = `
    fixed bottom-20 right-4 z-40
    w-14 h-14 bg-blue-500 text-white
    rounded-full shadow-lg
    flex items-center justify-center
    transition-all duration-200
    active:scale-95 active:shadow-md
    hover:bg-blue-600 hover:shadow-xl
    md:hidden
    ${className}
  `;

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {children || <Camera size={24} />}
      </button>
    );
  }

  return (
    <Link href={href} className={baseClasses}>
      {children || <Camera size={24} />}
    </Link>
  );
}