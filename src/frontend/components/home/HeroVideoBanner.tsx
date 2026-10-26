'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface HeroVideoBannerProps {
  language?: 'TA' | 'EN';
  videoSrc?: string;
  posterSrc?: string;
}

export default function HeroVideoBanner({
  language = 'TA',
  videoSrc = '/banner-video.mp4',
  posterSrc = '/poster.jpg',
}: HeroVideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync state if video plays/pauses naturally
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto my-6 sm:my-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-accent/40 relative group bg-black/90 select-none"
    >
      {/* If video fails to load, gracefully display fallback poster */}
      {hasError ? (
        <div className="relative w-full overflow-hidden">
          <img
            src={posterSrc}
            alt="Akshayam Matrimony Launch Banner"
            className="w-full h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 text-xs px-3 py-1.5 rounded-full border border-amber-300/30 flex items-center gap-1.5">
            <span>{language === 'TA' ? 'அக்‌ஷயம் அறிமுகம்' : 'Akshayam Intro'}</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full cursor-pointer" onClick={togglePlay}>
          {/* Native HTML5 Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setIsLoaded(true)}
            onError={() => {
              // Video file not yet added to /public, fallback to poster gracefully
              setHasError(true);
            }}
            className="w-full h-auto max-h-[75vh] object-cover sm:object-contain mx-auto block"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/banner-video.mp4" type="video/mp4" />
            <source src="/banner%20video.mp4" type="video/mp4" />
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Central Big Play Icon (when paused) */}
          {!isPlaying && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-accent"
                aria-label={language === 'TA' ? 'இயக்கு' : 'Play'}
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Top Info Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold border border-accent/40 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              {language === 'TA' ? 'அக்‌ஷயம் சிறப்பு வீடியோ' : 'Akshayam Special Video'}
            </span>
          </div>

          {/* Bottom Floating Control Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-20 ${
              showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 sm:opacity-0 group-hover:opacity-100 pointer-events-auto'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-3 overflow-hidden cursor-pointer">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs font-semibold">
              <div className="flex items-center gap-2">
                {/* Play / Pause button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Restart button */}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Sound toggle button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-red-300" />
                      <span className="hidden sm:inline text-[11px]">
                        {language === 'TA' ? 'ஒலி இயக்கவும்' : 'Unmute'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-green-300" />
                      <span className="hidden sm:inline text-[11px]">
                        {language === 'TA' ? 'ஒலி' : 'Sound On'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Fullscreen button */}
              <button
                type="button"
                onClick={handleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
