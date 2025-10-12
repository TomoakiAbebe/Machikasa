'use client';

import { useEffect, useState } from 'react';
import { LocalDB } from '@/lib/localDB';
import { Sponsor } from '@/types';

export default function SponsorCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  useEffect(() => {
    LocalDB.initialize();
    const activeSponsors = LocalDB.getSponsors().filter(s => s.active);
    setSponsors(activeSponsors);
  }, []);

  useEffect(() => {
    if (sponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSponsorIndex((prev) => (prev + 1) % sponsors.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [sponsors.length]);

  if (sponsors.length === 0) {
    return null;
  }

  const currentSponsor = sponsors[currentSponsorIndex];

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Sponsor Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-medium">協賛:</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img 
                  src={currentSponsor.logoUrl} 
                  alt={currentSponsor.name}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = currentSponsor.name.charAt(0);
                  }}
                />
                <div className="text-sm font-bold text-gray-700 hidden"></div>
              </div>
              <div>
                <div className="font-semibold text-sm">{currentSponsor.name}</div>
                <div className="text-xs opacity-90 truncate max-w-xs">
                  {currentSponsor.message}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          {sponsors.length > 1 && (
            <div className="flex items-center space-x-2">
              {sponsors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSponsorIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSponsorIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`View sponsor ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}