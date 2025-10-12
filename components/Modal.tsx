'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'max-h-[40vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[80vh]',
    full: 'h-full'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Touch interactions for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const startY = touch.clientY;
    const currentY = touch.clientY;
    const deltaY = Math.max(0, currentY - startY); // Only allow downward drag
    
    setDragY(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Close modal if dragged down more than 100px
    if (dragY > 100) {
      onClose();
    } else {
      // Snap back to original position
      setDragY(0);
    }
    
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-black/50 transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="absolute inset-x-0 bottom-0">
        <div 
          ref={modalRef}
          className={`
            bg-white rounded-t-3xl shadow-2xl
            transform ease-out
            ${sizeClasses[size]}
            ${isDragging ? 'transition-none' : 'transition-transform duration-300'}
            ${isAnimating ? 'translate-y-0' : 'translate-y-full'}
          `}
          style={{
            transform: `translateY(${isDragging ? dragY : (isAnimating ? 0 : '100%')}px)`
          }}
        >
          {/* Handle bar - Enhanced for touch */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
          </div>
          
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="
                    p-2 text-gray-400 hover:text-gray-600
                    rounded-full hover:bg-gray-100
                    transition-colors duration-200
                  "
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}