import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { mpGisBoundaries, mpGisSensors } from '../../services/gisMockData';
import type { GisBoundary } from '../../services/gisMockData';

interface MapContainerProps {
  split?: boolean;
}

export const MapContainer: React.FC<MapContainerProps> = ({ split = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const { 
    activeLayers,
    mapZoom,
    selectedIncident,
    activeBaseMap,
    splitBaseMap,
    timelineYear,
    selectedGisBoundary,
    setSelectedGisBoundary,
    measurementTool,
    setMeasurementTool,
    drawingMode,
    setDrawingMode,
    setCoordinates
  } = useStore();

  const currentBaseMap = split ? splitBaseMap : activeBaseMap;

  // Zoom and Pan state
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBoundary, setHoveredBoundary] = useState<GisBoundary | null>(null);

  // Drawing tools state
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number; lat: number; lng: number }[]>([]);
  const [isDrawingFinished, setIsDrawingFinished] = useState(false);

  // Bounds for coordinate conversion
  const minLat = 22.25;
  const maxLat = 23.05;
  const minLng = 75.05;
  const maxLng = 76.15;

  // Sync state zoom with store mapZoom
  useEffect(() => {
    setZoom(Math.pow(1.15, mapZoom - 12));
  }, [mapZoom]);

  const mapCoordsToCanvas = (lat: number, lng: number, width: number, height: number) => {
    // Normalise
    const xPct = (lng - minLng) / (maxLng - minLng);
    const yPct = (maxLat - lat) / (maxLat - minLat); // 0 is top

    const x = xPct * width;
    const y = yPct * height;

    return {
      x: (x - width / 2) * zoom + width / 2 + panX,
      y: (y - height / 2) * zoom + height / 2 + panY
    };
  };

  const canvasCoordsToMap = (x: number, y: number, width: number, height: number) => {
    // Reverse scale and translate
    const xUnzoomed = (x - panX - width / 2) / zoom + width / 2;
    const yUnzoomed = (y - panY - height / 2) / zoom + height / 2;

    const xPct = xUnzoomed / width;
    const yPct = yUnzoomed / height;

    const lng = minLng + xPct * (maxLng - minLng);
    const lat = maxLat - yPct * (maxLat - minLat);

    return { lat, lng };
  };

  // Ray-casting point-in-polygon helper
  const isPointInPolygon = (pt: { x: number; y: number }, poly: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y))
        && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Redraw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = canvas.parentElement?.clientHeight || 600;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Base Map Background
    if (currentBaseMap === 'satellite' || currentBaseMap === 'hybrid') {
      ctx.fillStyle = '#112211'; // Forest green / dark satellite
      ctx.fillRect(0, 0, width, height);

      // Draw some land masses contours
      ctx.fillStyle = '#163016';
      ctx.beginPath();
      ctx.arc(width * 0.4, height * 0.4, 250 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.7, height * 0.7, 300 * zoom, 0, Math.PI * 2);
      ctx.fill();
    } else if (currentBaseMap === 'terrain') {
      ctx.fillStyle = '#EBE3D5'; // Sandy beige terrain
      ctx.fillRect(0, 0, width, height);

      // Topographic lines simulation
      ctx.strokeStyle = '#D5C3A6';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(width * 0.5 + panX, height * 0.5 + panY, i * 80 * zoom, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else { // road
      ctx.fillStyle = '#1E1E1E'; // Dark minimalist grid
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Cartographic Grid lines
    ctx.strokeStyle = currentBaseMap === 'road' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    const gridSpacing = 80;
    for (let x = panX % gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = panY % gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Grid coordinates text
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    for (let x = panX % (gridSpacing * 2); x < width; x += gridSpacing * 2) {
      const mapPt = canvasCoordsToMap(x, 20, width, height);
      ctx.fillText(`${mapPt.lng.toFixed(2)}°E`, x + 4, 12);
    }
    for (let y = panY % (gridSpacing * 2); y < height; y += gridSpacing * 2) {
      const mapPt = canvasCoordsToMap(20, y, width, height);
      ctx.fillText(`${mapPt.lat.toFixed(2)}°N`, 4, y - 4);
    }

    // 3. Draw Water Bodies and Protected Forests Layers
    if (activeLayers.includes('waterbodies')) {
      ctx.fillStyle = 'rgba(44, 122, 223, 0.4)';
      ctx.strokeStyle = 'rgba(44, 122, 223, 0.8)';
      ctx.lineWidth = 2;
      // Narmada River simulation
      ctx.beginPath();
      const p1 = mapCoordsToCanvas(22.35, 75.1, width, height);
      const p2 = mapCoordsToCanvas(22.42, 75.5, width, height);
      const p3 = mapCoordsToCanvas(22.39, 76.1, width, height);
      ctx.moveTo(p1.x, p1.y);
      ctx.bezierCurveTo(p2.x, p2.y - 40, p2.x, p2.y + 40, p3.x, p3.y);
      ctx.stroke();
    }

    if (activeLayers.includes('forests')) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.lineWidth = 1.5;
      // Protected forest zone
      ctx.beginPath();
      const fp1 = mapCoordsToCanvas(22.8, 75.8, width, height);
      const fp2 = mapCoordsToCanvas(22.85, 76.0, width, height);
      const fp3 = mapCoordsToCanvas(22.7, 76.05, width, height);
      const fp4 = mapCoordsToCanvas(22.65, 75.85, width, height);
      ctx.moveTo(fp1.x, fp1.y);
      ctx.lineTo(fp2.x, fp2.y);
      ctx.lineTo(fp3.x, fp3.y);
      ctx.lineTo(fp4.x, fp4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = 'bold 9px system-ui';
      ctx.fillText("SATPURA STATE PARK Z-1", fp1.x + 10, fp1.y + 20);
    }

    // 4. Draw Environmental Gradients (NDVI, Groundwater, Carbon)
    if (activeLayers.includes('ndvi')) {
      // Vegetation green index gradient overlays
      ctx.fillStyle = 'rgba(22, 163, 74, 0.3)';
      const ndviCenter1 = mapCoordsToCanvas(22.6, 75.7, width, height);
      const rad1 = 120 * zoom;
      const grad1 = ctx.createRadialGradient(ndviCenter1.x, ndviCenter1.y, 10, ndviCenter1.x, ndviCenter1.y, rad1);
      grad1.addColorStop(0, 'rgba(22, 163, 74, 0.55)');
      grad1.addColorStop(1, 'rgba(22, 163, 74, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(ndviCenter1.x, ndviCenter1.y, rad1, 0, Math.PI * 2);
      ctx.fill();
    }

    if (activeLayers.includes('groundwater')) {
      // Groundwater depletion contour lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      const gwCenter = mapCoordsToCanvas(22.5, 75.3, width, height);
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(gwCenter.x, gwCenter.y, r * 45 * zoom, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (activeLayers.includes('carbon')) {
      // Carbon storage purple squares
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      const cb1 = mapCoordsToCanvas(22.75, 75.9, width, height);
      const boxSize = 80 * zoom;
      ctx.fillRect(cb1.x - boxSize/2, cb1.y - boxSize/2, boxSize, boxSize);
      ctx.strokeRect(cb1.x - boxSize/2, cb1.y - boxSize/2, boxSize, boxSize);
    }

    // 5. Draw Administrative & Vector Boundaries
    mpGisBoundaries.forEach(bound => {
      // Filter out admin types based on settings (e.g. parcel boundaries only visible at high zoom)
      if (bound.type === 'parcel' && zoom < 1.4) return;
      if (bound.type === 'village' && zoom < 0.7) return;

      const pts = bound.coordinates.map(c => mapCoordsToCanvas(c.lat, c.lng, width, height));
      
      // Determine highlight/hover status
      const isHovered = hoveredBoundary?.id === bound.id;
      const isSelected = selectedGisBoundary?.id === bound.id;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();

      // Style configurations
      if (bound.type === 'district') {
        ctx.strokeStyle = isSelected ? '#3B82F6' : isHovered ? '#F59E0B' : 'rgba(249, 115, 22, 0.7)'; // orange
        ctx.lineWidth = isSelected ? 3 : 2;
      } else if (bound.type === 'block') {
        ctx.strokeStyle = isSelected ? '#3B82F6' : isHovered ? '#F59E0B' : 'rgba(234, 179, 8, 0.5)'; // yellow
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
      } else if (bound.type === 'village') {
        ctx.strokeStyle = isSelected ? '#3B82F6' : isHovered ? '#F59E0B' : 'rgba(168, 85, 247, 0.6)'; // purple
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
      } else { // parcel
        ctx.strokeStyle = isSelected ? '#3B82F6' : isHovered ? '#F59E0B' : 'rgba(255, 255, 255, 0.25)'; // white/gray
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
      }

      // Translucent fills
      if (isSelected) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
        ctx.fill();
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
        ctx.fill();
      }

      ctx.stroke();
      ctx.setLineDash([]); // Reset
    });

    // 6. Draw Roads overlay (if road/hybrid map)
    if (currentBaseMap === 'road' || currentBaseMap === 'hybrid') {
      ctx.strokeStyle = '#D97706'; // Highway orange
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      const r1 = mapCoordsToCanvas(22.9, 75.2, width, height);
      const r2 = mapCoordsToCanvas(22.75, 75.8, width, height);
      const r3 = mapCoordsToCanvas(22.6, 76.1, width, height);
      ctx.moveTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.stroke();
    }

    // 7. Draw Active Incident Pin
    if (selectedIncident) {
      const incCoords = selectedIncident.coordinates.split(',').map(s => parseFloat(s.replace(/[^0-9.-]/g, '')));
      if (incCoords.length === 2) {
        const pin = mapCoordsToCanvas(incCoords[0], incCoords[1], width, height);
        
        // Pulsing circle
        const time = Date.now() / 300;
        const pulseRad = (15 + Math.sin(time) * 5) * zoom;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pulseRad, 0, Math.PI * 2);
        ctx.fill();

        // Pin marker
        ctx.fillStyle = '#EF4444';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 8 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.fillText("CRITICAL INCIDENT", pin.x + 12, pin.y + 4);
      }
    }

    // 8. Draw Sensors
    mpGisSensors.forEach(sensor => {
      const pt = mapCoordsToCanvas(sensor.lat, sensor.lng, width, height);
      ctx.fillStyle = sensor.status === 'critical' ? '#EF4444' : sensor.status === 'warning' ? '#F59E0B' : '#22C55E';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 9. Draw drawn geometries (Measurement or Drawing mode)
    if (drawnPoints.length > 0) {
      ctx.strokeStyle = '#EAB308'; // Yellow pencil
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      for (let i = 1; i < drawnPoints.length; i++) {
        ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
      }
      
      if (drawingMode === 'polygon' && isDrawingFinished) {
        ctx.closePath();
        ctx.fill();
      }

      ctx.stroke();

      // Drawn points circles
      drawnPoints.forEach((p, idx) => {
        ctx.fillStyle = '#EAB308';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '9px system-ui';
        ctx.fillText(`${idx + 1}`, p.x + 6, p.y - 4);
      });

      // Renders distance measurement overlay
      if (measurementTool === 'distance' && drawnPoints.length > 1) {
        let totalDist = 0;
        for (let i = 0; i < drawnPoints.length - 1; i++) {
          const pt1 = drawnPoints[i];
          const pt2 = drawnPoints[i + 1];
          // Simple cartesian to km conversion for Indore bounds
          const dy = (pt1.lat - pt2.lat) * 111.3;
          const dx = (pt1.lng - pt2.lng) * 102.5;
          totalDist += Math.sqrt(dx * dx + dy * dy);
        }
        
        const lastPt = drawnPoints[drawnPoints.length - 1];
        ctx.fillStyle = '#EAB308';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`MEASURED: ${totalDist.toFixed(2)} km`, lastPt.x + 12, lastPt.y + 16);
      }
    }

    // 10. Floating Overlays: Scale bar & Compass Rose
    // Draw Compass
    const compX = width - 40;
    const compY = height - 40;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(compX, compY, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(compX, compY - 18);
    ctx.lineTo(compX - 5, compY);
    ctx.lineTo(compX + 5, compY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#CCCCCC';
    ctx.beginPath();
    ctx.moveTo(compX, compY + 18);
    ctx.lineTo(compX - 5, compY);
    ctx.lineTo(compX + 5, compY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px monospace';
    ctx.fillText("N", compX - 2.5, compY - 21);

    // Draw Scale bar
    const scaleWidth = 80;
    const ptScaleStart = canvasCoordsToMap(20, height - 20, width, height);
    const ptScaleEnd = canvasCoordsToMap(20 + scaleWidth, height - 20, width, height);
    const dy = (ptScaleStart.lat - ptScaleEnd.lat) * 111.3;
    const dx = (ptScaleStart.lng - ptScaleEnd.lng) * 102.5;
    const distScaleKm = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(20, height - 25);
    ctx.lineTo(20 + scaleWidth, height - 25);
    ctx.lineTo(20 + scaleWidth, height - 20);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '9px monospace';
    ctx.fillText(`${distScaleKm.toFixed(1)} km`, 24, height - 30);

  }, [
    activeLayers,
    zoom,
    panX,
    panY,
    currentBaseMap,
    timelineYear,
    selectedGisBoundary,
    selectedIncident,
    hoveredBoundary,
    drawnPoints,
    drawingMode,
    measurementTool,
    isDrawingFinished
  ]);

  // Pointer Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode || measurementTool) {
      const mapPt = canvasCoordsToMap(x, y, rect.width, rect.height);
      const newPt = { x, y, ...mapPt };
      
      if (e.button === 2 || isDrawingFinished) {
        // Clear or Reset
        setDrawnPoints([newPt]);
        setIsDrawingFinished(false);
      } else {
        setDrawnPoints([...drawnPoints, newPt]);
      }
      return;
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mapPt = canvasCoordsToMap(x, y, rect.width, rect.height);
    setCoordinates(`${mapPt.lat.toFixed(4)}° N, ${mapPt.lng.toFixed(4)}° E`);

    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
      return;
    }

    // Hover Identification
    let foundHover: GisBoundary | null = null;
    mpGisBoundaries.forEach(bound => {
      // Boundary type limits based on scale/zoom
      if (bound.type === 'parcel' && zoom < 1.4) return;
      if (bound.type === 'village' && zoom < 0.7) return;

      const polyPoints = bound.coordinates.map(c => mapCoordsToCanvas(c.lat, c.lng, rect.width, rect.height));
      if (isPointInPolygon({ x, y }, polyPoints)) {
        foundHover = bound;
      }
    });

    setHoveredBoundary(foundHover);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    // If drawing or measuring, skip normal boundary click selections
    if (drawingMode || measurementTool) return;

    if (hoveredBoundary) {
      setSelectedGisBoundary(hoveredBoundary);
    } else {
      setSelectedGisBoundary(null);
    }
  };

  const handleDoubleClick = () => {
    if (drawingMode || measurementTool) {
      setIsDrawingFinished(true);
    }
  };

  const handleClearDrawings = () => {
    setDrawnPoints([]);
    setIsDrawingFinished(false);
  };

  const handlePreventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="absolute inset-0 z-0 bg-[#1E1E1E] overflow-hidden flex flex-col h-full">
      {/* Floating Toolbar inside Map */}
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant p-1 rounded-lg flex items-center gap-1 shadow-sm select-none">
          <button 
            onClick={() => setDrawingMode(drawingMode === 'polygon' ? null : 'polygon')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 ${
              drawingMode === 'polygon' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'
            }`}
            title="Sketch Area Boundary"
          >
            <span className="material-symbols-outlined text-[16px]">draw</span> Sketch Area
          </button>
          <button 
            onClick={() => setMeasurementTool(measurementTool === 'distance' ? null : 'distance')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 ${
              measurementTool === 'distance' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'
            }`}
            title="Measure Path Length"
          >
            <span className="material-symbols-outlined text-[16px]">straighten</span> Measure
          </button>
          {drawnPoints.length > 0 && (
            <button 
              onClick={handleClearDrawings}
              className="px-2.5 py-1.5 hover:bg-surface-container-high text-on-surface rounded text-xs font-bold uppercase flex items-center justify-center"
              title="Clear drawings"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span> Clear
            </button>
          )}
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handlePreventDefault}
        className="flex-1 cursor-grab active:cursor-grabbing w-full h-full block"
      />

      {/* Hover Information overlay */}
      {hoveredBoundary && (
        <div className="absolute left-4 bottom-24 bg-surface/95 backdrop-blur-md border border-outline-variant p-3 rounded-lg shadow-lg max-w-xs z-10 pointer-events-none select-none">
          <span className="text-[10px] text-primary font-bold uppercase block tracking-wider mb-0.5">
            Hover Info (Click to Pin)
          </span>
          <h4 className="font-bold text-body-md text-on-surface">
            {hoveredBoundary.name}
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            Type: <span className="font-semibold text-on-surface uppercase">{hoveredBoundary.type}</span>
          </p>
          {hoveredBoundary.areaAcres && (
            <p className="text-body-sm text-on-surface-variant">
              Area: <span className="font-mono">{hoveredBoundary.areaAcres} ac</span>
            </p>
          )}
          {hoveredBoundary.ndviScore && (
            <p className="text-body-sm text-on-surface-variant">
              NDVI Cover: <span className="font-bold text-primary">{hoveredBoundary.ndviScore}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapContainer;
