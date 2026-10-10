'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

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
const TRANSITION_MS = 900;  // 0.9s smooth slide

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slidingRef = useRef(false);
  slidingRef.current = isSliding;

  const nextIndex = (current + 1) % SLIDES.length;

  // Preload all slides in the browser cache so they never lag or flash black
  useEffect(() => {
    SLIDES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const triggerSlide = useCallback(() => {
    if (slidingRef.current) return;

    // Ensure next slide image is fully loaded in memory before initiating slide
    const nextSrc = SLIDES[(current + 1) % SLIDES.length];
    const preloader = new Image();
    preloader.src = nextSrc;

    const startAnimation = () => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
        setIsSliding(false);
      }, TRANSITION_MS);
    };

    if (preloader.complete) {
      startAnimation();
    } else {
      preloader.onload = startAnimation;
      preloader.onerror = startAnimation;
    }
  }, [current]);

  useEffect(() => {
    const id = setInterval(triggerSlide, INTERVAL_MS);
    return () => clearInterval(id);
  }, [triggerSlide]);

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
      {/* 2-Slide continuous track: eliminates any gap or black background between photos */}
      <div
        style={{
          display: 'flex',
          width: '200%',
          height: '100%',
          transform: isSliding ? 'translateX(-50%)' : 'translateX(0%)',
          transition: isSliding ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
          willChange: 'transform',
        }}
      >
        {/* Current slide */}
        <div style={{ width: '50%', height: '100%', position: 'relative', flexShrink: 0 }}>
          <img
            src={SLIDES[current]}
            alt=""
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              filter: 'contrast(1.04) brightness(1.02) saturate(1.04)',
            }}
          />
        </div>

        {/* Next slide (seamlessly connected side-by-side) */}
        <div style={{ width: '50%', height: '100%', position: 'relative', flexShrink: 0 }}>
          <img
            src={SLIDES[nextIndex]}
            alt=""
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              filter: 'contrast(1.04) brightness(1.02) saturate(1.04)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
