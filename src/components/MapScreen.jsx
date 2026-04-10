import React, { useEffect, useRef } from 'react';
import { TransformWrapper } from 'react-zoom-pan-pinch';
import { useStore } from '../store/useStore';
import MapCanvas from './MapCanvas';
import InfoCard from './InfoCard';
import BottomMenu from './BottomMenu';

export default function MapScreen({ deviceView = 'desktop' }) {
  const selectedLotId = useStore(state => state.selectedLotId);
  const fetchLotsData = useStore(state => state.fetchLotsData);
  const loading = useStore(state => state.loading);
  const error = useStore(state => state.error);
  const transformRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    fetchLotsData();
  }, [fetchLotsData]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        if (transformRef.current) {
          const { state } = transformRef.current;
          const containerCenterX = window.innerWidth / 2;
          const containerCenterY = window.innerHeight / 2;
          
          transformRef.current.setTransform(
            state.scale,
            containerCenterX - 1500 * state.scale,
            containerCenterY - 1500 * state.scale
          );
        }
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-[100dvh] bg-[#D8E2E1] overflow-hidden flex flex-col">
      {/* Contenedor del mapa - usa dvh para adaptarse a la pantalla */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          centerOnInit={true}
          limitToBounds={false}
        >
          <div className="w-full h-[100dvh-70px] sm:h-[100dvh-80px] lg:h-[100dvh-96px] overflow-hidden">
            <MapCanvas />
            
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 bg-[#D8E2E1]/80 flex items-center justify-center z-40">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-azul4 border-t-transparent rounded-full animate-spin" />
                  <span className="text-azul4 font-nexa font-bold text-sm tracking-wider">CARGANDO LOTES...</span>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && !loading && (
              <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 z-40">
                <p className="text-red-700 text-sm font-nexa text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Floating UI - Desktop */}
          {selectedLotId && deviceView === 'desktop' && (
            <div className="absolute z-50 pointer-events-none bottom-0 left-0 w-full">
              <InfoCard isDesktop={true} />
            </div>
          )}

          {/* Floating UI - Mobile/Tablet */}
          {selectedLotId && deviceView !== 'desktop' && (
            <div className="absolute z-50 pointer-events-none bottom-[70px] left-0">
              <InfoCard isDesktop={false} />
            </div>
          )}
        </TransformWrapper>
      </div>

      {/* Bottom Menu - siempre visible */}
      <div className="shrink-0">
        <BottomMenu />
      </div>
    </div>
  );
}