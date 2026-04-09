import React, { useEffect, useRef, useState } from 'react';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../store/useStore';

export default function MapCanvas() {
  const lotsData = useStore(state => state.lotsData);
  const selectedLotId = useStore(state => state.selectedLotId);
  const setSelectedLotId = useStore(state => state.setSelectedLotId);
  
  const [svgContent, setSvgContent] = useState('');
  const svgContainerRef = useRef(null);
  const clipPathIdRef = useRef(0);

  useEffect(() => {
    fetch('/mapa_svg.svg')
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error("Error loading SVG", err));
  }, []);

  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector('svg');
    if (!svgEl) return;
    
    svgEl.style.width = "100%";
    svgEl.style.height = "100%";
    
    const overlays = Array.from(svgEl.querySelectorAll('rect, image, use'));
    overlays.forEach(el => el.style.pointerEvents = 'none');
    
    const numeroManzanaGroups = Array.from(svgEl.querySelectorAll('g[id*="numero de manzana" i], g[id*="números de manzanas" i]'));
    numeroManzanaGroups.forEach(group => {
      const textsParams = group.querySelectorAll('path, text, rect, circle, ellipse');
      textsParams.forEach(child => {
        child.style.stroke = 'none';
        child.style.strokeWidth = '0';
      });
    });

    // Clean up old clipPaths and stroke paths from previous renders
    svgEl.querySelectorAll('clipPath.selection-clip').forEach(el => el.remove());
    svgEl.querySelectorAll('path.selection-stroke').forEach(el => el.remove());

    const lotGroups = Array.from(svgEl.querySelectorAll('g[id]')).filter(g => /^lotes\/M\d+_L\d+\//i.test(g.id));
    
    lotGroups.forEach(group => {
      const fullId = group.id;
      const lotIdMatch = fullId.match(/M\d+_L\d+/i);
      const lotId = lotIdMatch ? lotIdMatch[0] : fullId;
      const paths = Array.from(group.querySelectorAll('path'));
      if (!paths.length) return;

      const dbLot = lotsData.find(l => (l.ID === lotId || l.id === lotId));
      const st = dbLot?.Estado?.toLowerCase() || dbLot?.estado?.toLowerCase() || 'disponible';

      paths.forEach((path, index) => {
        path.style.cursor = "pointer";
        path.setAttribute('role', 'button');
        path.setAttribute('tabindex', '0');

        const isOuter = index === 0;
        const isInner = index === 1;
        const isNumber = index > 1;

        if (isOuter) {
          if (st === 'disponible') path.style.fill = '#C0B391';
          else if (st === 'bloqueada' || st === 'no disponible') path.style.fill = '#C4C0C0';
          else if (st === 'vendido' || st === 'vendida' || st === 'vendidas' || st === 'reservada') path.style.fill = '#7D7D7D';
        } 
        else if (isInner) {
          if (st === 'disponible') path.style.fill = '#E2D6BE';
          else if (st === 'bloqueada' || st === 'no disponible') path.style.fill = '#E4E4E4';
          else path.style.fill = '#969494';
        } 
        else if (isNumber) {
          if (st === 'bloqueada' || st === 'no disponible') path.style.fill = '#3F3F40'; 
          else if (st === 'vendido' || st === 'vendida' || st === 'vendidas' || st === 'reservada') path.style.fill = '#FFFFFF'; 
          else path.style.fill = '#3F3F40';
        }

        // Selection border: inside stroke via clipPath
        if (isOuter && selectedLotId === lotId) {
          const d = path.getAttribute('d');
          if (!d) return;

          const clipId = `sel-clip-${clipPathIdRef.current++}`;
          
          let defs = svgEl.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgEl.insertBefore(defs, svgEl.firstChild);
          }
          
          const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
          clipPath.setAttribute('id', clipId);
          clipPath.classList.add('selection-clip');
          const clipPathInner = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          clipPathInner.setAttribute('d', d);
          clipPath.appendChild(clipPathInner);
          defs.appendChild(clipPath);

          const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          strokePath.classList.add('selection-stroke');
          strokePath.setAttribute('d', d);
          strokePath.setAttribute('fill', 'none');
          strokePath.setAttribute('stroke', '#007C85');
          strokePath.setAttribute('stroke-width', '6');
          strokePath.setAttribute('clip-path', `url(#${clipId})`);
          strokePath.style.pointerEvents = 'none';
          group.appendChild(strokePath);
        }
      });
    });
  }, [lotsData, selectedLotId, svgContent]);

  const handleSvgClick = (e) => {
    let target = e.target;
    if (!svgContainerRef.current || !svgContainerRef.current.contains(target)) return;

    const lotGroup = target.closest('g[id]');
    if (lotGroup && /^lotes\/M\d+_L\d+\//i.test(lotGroup.id)) {
      const match = lotGroup.id.match(/M\d+_L\d+/i);
      if (match) {
        setSelectedLotId(match[0]);
        return;
      }
    }
    
    setSelectedLotId(null);
  };

  return (
    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
      <div 
        ref={svgContainerRef}
        onClick={handleSvgClick}
        className="w-[3000px] h-[3000px] flex items-center justify-center pointer-events-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }} 
      />
    </TransformComponent>
  );
}
