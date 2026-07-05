'use client';

export default function StaticBackground() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 35%, #e0f2fe 65%, #f0fdff 100%)',
        }}
      />
      {/* Soft blurred decorative orbs - purely CSS, no animation overhead */}
      <div style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
        top: '-150px', right: '-150px',
      }} />
      <div style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
        bottom: '-100px', left: '-100px',
      }} />
      <div style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(103,232,249,0.07) 0%, transparent 70%)',
        top: '40%', left: '30%',
      }} />
    </>
  );
}
