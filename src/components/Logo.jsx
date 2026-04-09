import React from 'react';

export default function Logo({ className = "", width = "w-16" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img src="/LA-logo.png" alt="Las Achiras" className={`h-auto ${width}`} />
    </div>
  );
}
