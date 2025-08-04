
import React from 'react';

export const EthOsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 160 160" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="100%" stopColor="#a5b4fc" />
      </linearGradient>
    </defs>
    <path d="M80 0 L160 80 L80 160 L0 80 Z" fill="url(#logoGradient)" />
    <g stroke="black" strokeWidth="6" fill="none" strokeLinecap="round">
      <path d="M80,10 L80,70 L95,80 L70,90 L80,90 L80,150" />
      <path d="M40,115 C60,140 100,140 120,115" />
    </g>
    <rect x="45" y="55" width="10" height="10" fill="black" />
    <rect x="105" y="55" width="10" height="10" fill="black" />
  </svg>
);

export const EthereumLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16,3,15.91,4.95,16,5,24,12,16,16.5,8,12,16,5M16,3,8,12v7.5L16,24l8-4.5V12L16,3Z" fill="#c4b5fd"/>
    <path d="m16 17.61 8-4.5v5.29L16 22.9l-8-4.5v-5.3L16 17.61Z" fill="#a78bfa"/>
    <path d="m8 12 8 4.5V24L8 19.5Z" fill="#ddd6fe"/>
    <path d="m16 16.5 8-4.5v7.5L16 24Z" fill="#c4b5fd"/>
  </svg>
);
