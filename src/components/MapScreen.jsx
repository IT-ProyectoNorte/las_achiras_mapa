import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { useStore } from '../store/useStore';
import MapCanvas from './MapCanvas';
import InfoCard from './InfoCard';
import BottomMenu from './BottomMenu';

const zoomControlsRef = { current: { zoomIn: null, zoomOut: null } };

function MapContent({ loading, error }) {
  const { zoomIn, zoomOut } = useControls();
  
  useEffect(() => {
    zoomControlsRef.current = { zoomIn, zoomOut };
  }, [zoomIn, zoomOut]);
  
  return (
    <div className="w-full h-full">
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
  );
}



export default function MapScreen({ deviceView = 'desktop' }) {
  const selectedLotId = useStore(state => state.selectedLotId);
  const lotsData = useStore(state => state.lotsData);
  const fetchLotsData = useStore(state => state.fetchLotsData);
  const loading = useStore(state => state.loading);
  const error = useStore(state => state.error);

  
  
  
  const showInfoCard = !!selectedLotId;
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
    <div className="w-full h-[100dvh] bg-[#D8E2E1] overflow-hidden flex flex-col relative">
      {/* Contenedor del mapa - scroll nativo */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          centerOnInit={true}
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <MapContent 
              loading={loading} 
              error={error} 
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* InfoCard Desktop - tapa el menú */}
      {showInfoCard && deviceView === 'desktop' && (
        <div className="absolute inset-0 pointer-events-none flex items-end">
          <div className="pointer-events-auto w-full z-[200]">
            <InfoCard isDesktop={true} />
          </div>
        </div>
      )}

      {/* InfoCard Mobile/Tablet - fijo debajo del mapa pero arriba del menú */}
      {showInfoCard && deviceView !== 'desktop' && (
        <div className="absolute z-50 bottom-[70px] left-0 pointer-events-none">
          <div className="pointer-events-auto">
            <InfoCard isDesktop={false} />
          </div>
        </div>
      )}

      {/* Bottom Menu - fijo debajo */}
      <div className="shrink-0 z-40">
        <BottomMenu 
          onZoomIn={() => zoomControlsRef.current.zoomIn?.()} 
          onZoomOut={() => zoomControlsRef.current.zoomOut?.()} 
        />
      </div>
    </div>
  );
}