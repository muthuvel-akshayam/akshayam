'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselItem = {
  id: string;
  mediaUrl: string;
  type: string;
};

export default function HeroCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/carousel');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    
    // Default 5 second interval
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white aspect-[3/4] animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Fallback to default static image if no items are configured
  if (items.length === 0) {
    return (
      <div className="w-full max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
        <img 
          src="/hero-couple.png" 
          alt="Akshayam Bride and Groom" 
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white relative group">
      
      <div className="w-full h-full relative aspect-[3/4] sm:aspect-auto">
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-full h-full flex-shrink-0">
              {item.type === 'VIDEO' ? (
                <video 
                  src={item.mediaUrl} 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
              ) : (
                <img 
                  src={item.mediaUrl} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (only show if multiple items) */}
      {items.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
