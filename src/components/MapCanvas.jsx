import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

// Estados que NO son clickeables
const BLOCKED_STATES = ['vendida', 'reservada', 'bloqueada'];

function isBlocked(estado) {
  if (!estado) return false;
  return BLOCKED_STATES.includes(estado.toLowerCase().trim());
}

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
        if (child.tagName === 'circle' || child.tagName === 'ellipse') {
          child.style.stroke = 'white';
          child.style.strokeWidth = '1px';
        } else {
          child.style.stroke = 'none';
          child.style.strokeWidth = '0';
        }
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
      const st = dbLot?.Estado?.toLowerCase().trim() || dbLot?.estado?.toLowerCase().trim() || 'disponible';
      const blocked = isBlocked(st);

      paths.forEach((path, index) => {
        const isOuter = index === 0;
        const isInner = index === 1;
        const isNumber = index > 1;

        // Colores: disponible = arena, cualquier otro estado = gris
        if (isOuter) {
          if (st === 'disponible') path.style.fill = '#C0B391';
          else                     path.style.fill = '#8f8f8f';
        } 
        else if (isInner) {
          if (st === 'disponible') path.style.fill = '#E2D6BE';
          else                     path.style.fill = '#636363';
        } 
        else if (isNumber) {
          if (st === 'disponible') path.style.fill = '#3F3F40';
          else                     path.style.fill = '#FFFFFF';
        }

        // Cursor y pointer-events según estado
        if (blocked) {
          path.style.cursor = 'not-allowed';
          path.style.pointerEvents = 'auto';
          path.removeAttribute('role');
          path.removeAttribute('tabindex');
        } else {
          path.style.cursor = 'pointer';
          path.setAttribute('role', 'button');
          path.setAttribute('tabindex', '0');
        }

        // Selection border: para todos los lotes no bloqueados seleccionados
        if (isOuter && selectedLotId === lotId && !blocked) {
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
        const lotId = match[0];
        // Verificar si el lote está bloqueado antes de seleccionar
        const dbLot = lotsData.find(l => (l.ID === lotId || l.id === lotId));
        const st = dbLot?.Estado?.toLowerCase().trim() || dbLot?.estado?.toLowerCase().trim() || 'disponible';
        if (!isBlocked(st)) {
          setSelectedLotId(lotId);
        }
        return;
      }
    }
    
    setSelectedLotId(null);
  };

  return (
    <div 
      ref={svgContainerRef}
      onClick={handleSvgClick}
      className="w-[3000px] h-[3000px] flex items-center justify-center pointer-events-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}
