'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LandingProfileCard from './LandingProfileCard';

interface ProfileCarouselProps {
  profiles: any[];
  title: string;
}

export default function ProfileCarousel({ profiles, title }: ProfileCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial calculation
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [profiles]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const clientWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: -(clientWidth * 0.8), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const clientWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={scrollLeft}
            disabled={scrollProgress === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollRight}
            disabled={scrollProgress >= 0.99}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 py-2 px-1 scrollbar-none hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {profiles.map((profile, idx) => (
          <div key={profile.id || idx} className="shrink-0 w-[270px] sm:w-[280px] snap-start">
            <LandingProfileCard profile={profile} />
          </div>
        ))}
      </div>

      {/* Dots pagination */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: Math.ceil(profiles.length / 3) }).map((_, idx) => {
          const isActive = Math.abs(scrollProgress - (idx / (Math.ceil(profiles.length / 3) - 1 || 1))) < 0.1;
          return (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`} 
            />
          );
        })}
      </div>
    </div>
  );
}
