import React from 'react';
import { useStore } from '../store/useStore';
import { Map } from 'lucide-react';
import Logo from './Logo';

export default function Tutorial() {
  const dismissTutorial = useStore(state => state.dismissTutorial);

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-y-auto overflow-x-hidden text-center text-white font-nexa">
      {/* Top Header Logo Area */}
      <div className="py-4 sm:py-6 md:py-10 flex shrink-0 items-center justify-center">
        <Logo width="w-28" className="sm:hidden" />
        <Logo width="w-28" className="hidden sm:block md:hidden" />
        <Logo width="w-40" className="hidden md:block" />
      </div>

      {/* Tutorial Section */}
      <div className="bg-azul4 py-6 sm:py-8 md:py-16 px-4 sm:px-8 flex shrink-0 flex-col items-center justify-center gap-4 sm:gap-6 md:gap-12">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-cocomat">¿Cómo funciona?</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12 items-center justify-center">
          <div className="flex flex-col items-center gap-1 md:gap-4">
            <img src="/tutorial_mover.svg" alt="Arrastra" className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            <p className="text-xs md:text-xl"><span className="font-bold">Arrastra</span><br/>para moverte por el mapa.</p>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-4">
            <img src="/tutorial_clic.svg" alt="Toca un lote" className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            <p className="text-xs md:text-xl"><span className="font-bold">Toca un lote</span><br/>para ver su información.</p>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-4">
            <img src="/tutorial_zoom.svg" alt="Zoom" className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            <p className="text-xs md:text-xl"><span className="font-bold">Ajusta el zoom</span><br/>utilizando la rueda del mouse.</p>
          </div>
        </div>
      </div>

      {/* Continue Section */}
      <div className="bg-[#a6d1d5] flex-1 py-4 sm:py-8 md:py-16 px-4 flex flex-col items-center justify-center min-h-[160px] gap-4 sm:gap-6 md:gap-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-cocomat text-azul4">¡Estás listo para explorar!</h2>
        <button 
          onClick={dismissTutorial}
          className="flex items-center gap-2 sm:gap-3 bg-azul4 hover:bg-azul3 text-white font-bold text-xs sm:text-sm md:text-lg py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-full shadow-xl transition-all hover:scale-105 tracking-widest cursor-pointer"
        >
          <Map size={20} className="md:w-7 md:h-7" />
          VER EL MAPA
        </button>
      </div>

      {/* Logo Proyecto Norte - Fixed bottom-right */}
      <img 
        src="/logo_proyecto_norte.svg" 
        alt="Proyecto Norte" 
        className="fixed bottom-0 right-0 w-20 sm:w-24 md:w-28 z-50 pointer-events-none" 
      />
    </div>
  );
}
