'use client';

import React, { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  '/hero-slide-1.jpg',
  '/hero-slide-2.jpg',
  '/hero-slide-3.jpg',
  '/hero-slide-4.jpg',
  '/hero-slide-5.jpg',
  '/hero-slide-6.jpg',
  '/hero-slide-7.jpg',
  '/hero-slide-8.jpg',
  '/hero-slide-9.jpg',
  '/hero-slide-10.jpg',
  '/hero-slide-11.jpg',
  '/hero-slide-12.jpg',
  '/hero-slide-13.jpg',
  '/hero-slide-14.jpg',
  '/hero-slide-15.jpg',
  '/hero-slide-16.jpg',
  '/hero-slide-17.jpg',
  '/hero-slide-18.jpg',
  '/hero-slide-19.jpg',
  '/hero-slide-20.jpg',
  '/hero-slide-21.jpg',
  '/hero-slide-22.jpg',
  '/hero-slide-23.jpg',
];

const INTERVAL_MS = 10_000; // 10 seconds per slide

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);

  const goNext = useCallback(() => {
    setSliding(true);
    setPrev(current);
    setCurrent(c => (c + 1) % SLIDES.length);

    // After the CSS transition finishes, clear the "prev" layer
    setTimeout(() => {
      setPrev(null);
      setSliding(false);
    }, 800); // matches the CSS transition duration
  }, [current]);

  useEffect(() => {
    const id = setInterval(goNext, INTERVAL_MS);
    return () => clearInterval(id);
  }, [goNext]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Previous slide — slides out to the left */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={SLIDES[prev]}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            transform: sliding ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
            willChange: 'transform',
          }}
        />
      )}

      {/* Current slide — slides in from the right */}
      <img
        key={`curr-${current}`}
        src={SLIDES[current]}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          transform: sliding ? 'translateX(0)' : 'translateX(0)',
          transition: 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'transform',
          // Starts offscreen-right when sliding in
          animation: prev !== null ? 'slideIn 0.8s cubic-bezier(0.77,0,0.175,1) forwards' : 'none',
        }}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
