import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { Plus, Minus } from 'lucide-react';
import Logo from './Logo';

export default function BottomMenu() {
  const { zoomIn, zoomOut } = useControls();

  return (
    <div className="bg-white rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] px-3 py-4 sm:py-4 md:px-6 md:py-5 flex flex-row items-center justify-between gap-2 sm:gap-4 md:gap-6 pointer-events-auto">
       
       {/* References - vertical on mobile/tablet, horizontal on desktop */}
       <div className="flex flex-col sm:flex-col md:flex-row items-start md:items-center gap-1.5 sm:gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-[#E2D6BE] shrink-0"></div>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#49494a] tracking-wider leading-none">DISPONIBLE</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-[#969494] shrink-0"></div>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#49494a] tracking-wider leading-none">VENDIDA</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-[#C4C0C0] shrink-0"></div>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#49494a] tracking-wider leading-none">NO DISPONIBLE</span>
          </div>
       </div>

       {/* Zoom + Logo */}
       <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Zoom */}
          <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button onClick={() => zoomOut()} aria-label="Alejar zoom" className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 rounded-full border border-azul4 opacity-50 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                <Minus size={16} sm:size={18} md:size={18} strokeWidth={3} className="text-azul4" />
              </button>
              <button onClick={() => zoomIn()} aria-label="Acercar zoom" className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 rounded-full border border-azul4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                <Plus size={16} sm:size={18} md:size={18} strokeWidth={3} className="text-azul4" />
              </button>
            </div>
            <span className="text-azul4 text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] leading-none">ZOOM</span>
          </div>

          <div className="w-[1px] h-10 sm:h-12 md:h-14 bg-gray-200" />

          {/* Logo */}
          <div className="flex items-center justify-center">
            <Logo width="w-14 sm:w-16 md:w-20" />
          </div>
       </div>

    </div>
  );
}
