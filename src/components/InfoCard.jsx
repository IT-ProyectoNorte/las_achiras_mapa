import React from 'react';
import { useStore } from '../store/useStore';
import { X, Square, Compass, CircleDollarSign } from 'lucide-react';
import Logo from './Logo';

export default function InfoCard({ isDesktop = false }) {
  const selectedLotId = useStore(state => state.selectedLotId);
  const lotsData = useStore(state => state.lotsData);
  const setSelectedLotId = useStore(state => state.setSelectedLotId);

  if (!selectedLotId) return null;

  // Parse M and L numbers from the ID (e.g. "M1_L12") as fallback
  const idMatch = selectedLotId?.match(/M(\d+)_L(\d+)/i);
  const fallbackManzana = idMatch ? idMatch[1] : '?';
  const fallbackLote = idMatch ? idMatch[2] : '?';

  // Match by the ID column in Achiras table (must match exactly "M1_L1")
  const lot = lotsData.find(l => (
    l.ID === selectedLotId
  )) || {
    ID: selectedLotId,
    Estado: 'Sin datos',
    Superficie: '---',
    Precio: '---',
    Manzana: fallbackManzana,
    Lote: fallbackLote,
    Orientacion: '---'
  };

  const orientacionValue = lot.Orientacion || '---';
  const mText = `M ${lot.Manzana || fallbackManzana}`;
  const lText = `LOTE ${lot.Lote || fallbackLote}`;

  if (isDesktop) {
    return (
      <div className="w-full bg-white h-[96px] flex items-stretch shadow-[0px_-3px_15px_rgba(2,65,71,0.15)] rounded-t-[15px] pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Left Header — Hug content */}
        <div className="bg-azul4 px-8 flex items-center justify-center gap-6 shrink-0 rounded-tl-[15px]">
          <span className="text-[24px] text-white font-cocomat tracking-wide whitespace-nowrap">{mText}</span>
          <div className="w-[1.5px] h-[24px] bg-white opacity-20" />
          <span className="text-[24px] text-white font-cocomat tracking-wide whitespace-nowrap">{lText}</span>
        </div>

        {/* Info Body — Fill all available space */}
        <div className="bg-[#E4F1F2] px-8 flex flex-1 min-w-0 items-center justify-center gap-12">
           <div className="flex items-center gap-3 text-[#49494a]">
               <Square size={24} className="text-azul2 shrink-0" />
               <div className="font-nexa text-[18px] font-bold flex items-baseline whitespace-nowrap">
                   {lot.Superficie} <span className="ml-[2px] font-normal"> m<span className="text-[10px] align-top">2</span></span>
               </div>
           </div>
           <div className="flex items-center gap-3 text-[#49494a]">
               <Compass size={24} className="text-azul2 shrink-0" />
               <span className="font-nexa text-[18px] font-bold whitespace-nowrap">{orientacionValue}</span>
           </div>
           <div className="flex items-center gap-3 text-[#49494a]">
               <CircleDollarSign size={24} className="text-azul2 shrink-0" />
               <span className="font-nexa text-[18px] font-bold whitespace-nowrap">{lot.Precio} USD</span>
           </div>
        </div>

        {/* References — Hug content */}
        <div className="flex items-center px-4 shrink-0 bg-white border-l border-gray-100">
            <div className="flex flex-col gap-1.5 justify-center">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#E2D6BE]" />
                 <span className="font-nexa font-bold text-[10px] text-[#49494a] tracking-[0.2px] whitespace-nowrap uppercase">DISPONIBLE</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#969494]" />
                 <span className="font-nexa font-bold text-[10px] text-[#49494a] tracking-[0.2px] whitespace-nowrap uppercase">VENDIDA</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#C4C0C0]" />
                 <span className="font-nexa font-bold text-[10px] text-[#49494a] tracking-[0.2px] whitespace-nowrap uppercase">NO DISPONIBLE</span>
              </div>
            </div>
        </div>

        {/* Logo — Hug content */}
        <div className="flex items-center px-4 shrink-0 bg-white border-l border-gray-100">
            <Logo width="w-16" />
        </div>

        {/* Close Button — Hug content */}
        <button 
           className="bg-azul4 px-5 flex items-center justify-center shrink-0 rounded-tr-[15px] hover:bg-azul3 transition-colors cursor-pointer"
           onClick={() => setSelectedLotId(null)}
           aria-label="Cerrar información del lote"
        >
            <X size={24} color="white" />
        </button>

      </div>
    );
  }

  // Mobile / Tablet View
  return (
    <div className="w-[280px] flex flex-col bg-[#a6d1d5] rounded-tr-[15px] overflow-hidden shadow-[3px_-2px_10px_rgba(0,65,71,0.15)] pointer-events-auto animate-in slide-in-from-left-10 duration-300">
      
      {/* Close Wrapper */}
      <div className="bg-azul4 w-full flex justify-end pt-3 px-4">
        <button onClick={() => setSelectedLotId(null)} aria-label="Cerrar información del lote" className="text-white hover:text-gray-200 transition-colors cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="bg-azul4 w-full flex items-center justify-center gap-5 pb-6 pt-1">
         <span className="text-[32px] text-white font-cocomat tracking-wider whitespace-nowrap">{mText}</span>
         <div className="w-[2px] h-[25px] bg-white opacity-20 shrink-0" />
         <span className="text-[32px] text-white font-cocomat tracking-wider whitespace-nowrap">{lText}</span>
      </div>

      {/* Body */}
      <div className="w-full flex flex-col items-start gap-4 px-8 pt-8 pb-10">
         <div className="flex items-center gap-4 text-[#49494a]">
             <Square size={24} className="text-azul2" />
             <div className="font-nexa text-[16px] font-bold leading-none flex items-baseline whitespace-nowrap">
                 {lot.Superficie} <span className="ml-[2px] font-normal"> m<span className="text-[10px] align-top">2</span></span>
             </div>
         </div>
         <div className="flex items-center gap-4 text-[#49494a]">
             <Compass size={24} className="text-azul2" />
             <span className="font-nexa text-[16px] font-bold leading-none whitespace-nowrap">{orientacionValue}</span>
         </div>
         <div className="flex items-center gap-4 text-[#49494a]">
             <CircleDollarSign size={24} className="text-azul2" />
             <span className="font-nexa text-[16px] font-bold leading-none whitespace-nowrap">{lot.Precio} USD</span>
         </div>
      </div>
      
    </div>
  );
}
