import React from 'react';

export default function AnimatedBackground() {
  return (
    <>
      {/* Layer 1: Floating Dots */}
      <div className="bg-layer-dots"></div>

      {/* Layer 2: Thin Curved Wave Lines */}
      <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden opacity-[0.03]">
        <svg
          className="w-[200%] h-full object-cover origin-left"
          style={{ animation: 'waveDrift 20s ease-in-out infinite' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="rgba(89, 98, 74, 1)"
            strokeWidth="1"
            d="M0,160 C320,300,420,0,740,160 C1060,320,1160,0,1440,160"
          ></path>
          <path
            fill="none"
            stroke="rgba(89, 98, 74, 1)"
            strokeWidth="0.5"
            d="M0,200 C400,350,500,50,900,200 C1300,350,1400,50,1440,200"
          ></path>
        </svg>
      </div>

      {/* Layer 3: Orbit Circles */}
      <div className="bg-layer-orbit">
        <div className="orbit-circle w-[600px] h-[600px] -top-[100px] -right-[100px]" style={{ animationDuration: '60s' }} />
        <div className="orbit-circle w-[800px] h-[800px] -bottom-[200px] -left-[200px]" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />
      </div>

      {/* Layer 4: Micro Decorative Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.06] text-[var(--olive-primary)] font-mono">
        {/* Plus symbols */}
        <div className="absolute top-[20%] left-[10%]" style={{ animation: 'floatMicro 25s infinite' }}>+</div>
        <div className="absolute top-[60%] right-[15%]" style={{ animation: 'floatMicro 30s infinite', animationDelay: '2s' }}>+</div>
        <div className="absolute bottom-[20%] left-[30%]" style={{ animation: 'floatMicro 20s infinite', animationDelay: '5s' }}>+</div>
        
        {/* Diamonds */}
        <div className="absolute top-[30%] right-[30%] w-2 h-2 border border-[var(--olive-primary)] rotate-45" style={{ animation: 'floatMicro 28s infinite' }}></div>
        <div className="absolute bottom-[40%] left-[15%] w-1.5 h-1.5 border border-[var(--olive-primary)] rotate-45" style={{ animation: 'floatMicro 22s infinite', animationDelay: '3s' }}></div>
        
        {/* Hollow circles */}
        <div className="absolute top-[10%] right-[40%] w-3 h-3 border border-[var(--olive-primary)] rounded-full" style={{ animation: 'floatMicro 35s infinite' }}></div>
        <div className="absolute bottom-[10%] right-[10%] w-2 h-2 border border-[var(--olive-primary)] rounded-full" style={{ animation: 'floatMicro 26s infinite', animationDelay: '4s' }}></div>
      </div>
    </>
  );
}
