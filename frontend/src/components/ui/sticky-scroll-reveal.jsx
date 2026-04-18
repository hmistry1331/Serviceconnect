import React, { useRef, useState } from 'react';
import { useMotionValueEvent, useScroll, motion as Motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const cardsBreakpoints = content.map((_, i) => i / cardLength);
    const closest = cardsBreakpoints.reduce((acc, bp, i) =>
      Math.abs(latest - bp) < Math.abs(latest - cardsBreakpoints[acc]) ? i : acc
    , 0);
    setActiveCard(closest);
  });

  return (
    <div ref={ref} className="relative flex gap-16 justify-center px-4 md:px-12">

      {/* ── LEFT: scrolling text blocks ── */}
      <div className="flex flex-col flex-1 max-w-xl">
        {content.map((item, index) => (
          <div key={item.title + index} className="min-h-[60vh] flex flex-col justify-center py-20">

            {/* Step counter + progress line */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: activeCard === index ? 'rgba(232,197,71,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeCard === index ? 'rgba(232,197,71,0.4)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: activeCard === index ? '#e8c547' : '#4a7070',
                transition: 'all 0.4s ease',
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                <Motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeCard === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, #e8c547, transparent)',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </Motion.div>

            {/* Title */}
            <Motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: activeCard === index ? 1 : 0.2, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(26px, 3.5vw, 38px)',
                fontWeight: 700, color: '#ffffff',
                letterSpacing: '-0.02em', lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              {item.title}
            </Motion.h3>

            {/* Description */}
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              style={{ fontSize: 15, color: '#7a9c9c', lineHeight: 1.75, maxWidth: 420, marginBottom: 24 }}
            >
              {item.description}
            </Motion.p>

            {/* Tag badge */}
            {item.tag && (
              <Motion.div
                animate={{ opacity: activeCard === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(232,197,71,0.08)',
                  border: '1px solid rgba(232,197,71,0.2)',
                  borderRadius: 8, padding: '6px 12px', width: 'fit-content',
                }}
              >
                {item.tagIcon && <item.tagIcon size={13} color="#e8c547" />}
                <span style={{ fontSize: 12, color: '#e8c547', fontWeight: 600 }}>{item.tag}</span>
              </Motion.div>
            )}
          </div>
        ))}
        <div style={{ height: '30vh' }} />
      </div>

      {/* ── RIGHT: sticky visual panel ── */}
      <div
        className={cn('hidden lg:block sticky top-28 self-start', contentClassName)}
        style={{ width: 420, flexShrink: 0 }}
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeCard}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 20, overflow: 'hidden',
              border: '1px solid rgba(232,197,71,0.15)',
              background: '#0a1818',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,197,71,0.06)',
              minHeight: 360,
            }}
          >
            {/* Window chrome bar */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.02)',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i === 0 ? 'rgba(232,197,71,0.5)' : i === 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                }} />
              ))}
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)', marginLeft: 4 }} />
              <span style={{ fontSize: 11, color: '#2a4040', fontWeight: 600 }}>
                step {String(activeCard + 1).padStart(2, '0')} / {String(cardLength).padStart(2, '0')}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: 28 }}>
              {content[activeCard]?.content ?? (
                <div style={{
                  height: 280, borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 12, color: '#2a4040' }}>Add your image here</span>
                </div>
              )}
            </div>

            {/* Progress dots */}
            <div style={{ padding: '0 28px 20px', display: 'flex', gap: 6 }}>
              {content.map((_, i) => (
                <div key={i} style={{
                  height: 3, borderRadius: 2,
                  background: i === activeCard ? '#e8c547' : 'rgba(255,255,255,0.1)',
                  flex: i === activeCard ? 2 : 1,
                  transition: 'flex 0.35s ease, background 0.35s ease',
                }} />
              ))}
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
