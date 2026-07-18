import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { X } from 'lucide-react';

// Rastgele olay noktaları (şehirler)
const generateMockPoints = () => {
  const points = [];
  const coords = [
    { lat: 40.7128, lng: -74.0060, name: 'New York', news: 'Wall Street güne rekor yükselişle başladı.' },
    { lat: 51.5074, lng: -0.1278, name: 'London', news: 'İngiltere Merkez Bankası faiz kararını açıkladı.' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', news: 'Japonya\'da teknoloji hisselerinde ralli devam ediyor.' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', news: 'Avustralya\'da yeni madencilik yatırımları onaylandı.' },
    { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', news: 'Asya borsaları haftayı dalgalı kapattı.' },
    { lat: 48.8566, lng: 2.3522, name: 'Paris', news: 'İklim anlaşması için yeni hedefler belirlendi.' },
    { lat: 41.0082, lng: 28.9784, name: 'Istanbul', news: 'Avrupa ve Asya\'yı bağlayan yeni ticaret rotası açıldı.' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore', news: 'Kripto para düzenlemelerinde yeni dönem.' }
  ];

  for (let i = 0; i < coords.length; i++) {
    points.push({
      lat: coords[i].lat + (Math.random() - 0.5) * 2,
      lng: coords[i].lng + (Math.random() - 0.5) * 2,
      size: Math.random() * 0.5 + 0.2,
      color: ['#06b6d4', '#10b981', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 4)],
      label: coords[i].name,
      news: coords[i].news
    });
  }
  return points;
};

// Noktalar arası rastgele yaylar (haber akışını temsil eden uçuş çizgileri)
const generateMockArcs = (points: any[]) => {
  const arcs = [];
  for (let i = 0; i < 15; i++) {
    const startPoint = points[Math.floor(Math.random() * points.length)];
    const endPoint = points[Math.floor(Math.random() * points.length)];
    if (startPoint !== endPoint) {
      arcs.push({
        startLat: startPoint.lat,
        startLng: startPoint.lng,
        endLat: endPoint.lat,
        endLng: endPoint.lng,
        color: ['rgba(6, 182, 212, 0.5)', 'rgba(139, 92, 246, 0.5)'][Math.floor(Math.random() * 2)]
      });
    }
  }
  return arcs;
};

export const WorldGlobe: React.FC = () => {
  const globeEl = useRef<any>();
  const [points, setPoints] = useState<any[]>([]);
  const [arcs, setArcs] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Seçili nokta (popup için)
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  useEffect(() => {
    const initialPoints = generateMockPoints();
    setPoints(initialPoints);
    setArcs(generateMockArcs(initialPoints));

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !selectedPoint; // Stop rotation if popup is open
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = true;
    }
  }, [dimensions, selectedPoint]);

  const handlePointClick = (point: any) => {
    setSelectedPoint(point);
    // Kamerayı noktaya doğru çevir
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}
    >
      {dimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          pointsData={points}
          pointAltitude="size"
          pointColor="color"
          pointRadius={selectedPoint ? 0.3 : 0.5}
          onPointClick={handlePointClick}
          pointLabel="label"
          
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.5}
          arcDashGap={1}
          arcDashAnimateTime={2000}
          
          atmosphereColor="#1e293b"
          atmosphereAltitude={0.10}
        />
      )}
      
      {/* Etkileşim İpucu */}
      {!selectedPoint && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          background: 'var(--bg-panel)',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          border: 'var(--glass-border)',
          backdropFilter: 'var(--glass-blur)',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          pointerEvents: 'none',
          animation: 'slide-down 0.5s ease-out forwards'
        }}>
          Noktalara tıklayarak bölgesel haberleri görebilirsiniz
        </div>
      )}

      {/* Popup (Selected Point Detail) */}
      {selectedPoint && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--accent-cyan)',
          backdropFilter: 'blur(16px)',
          color: 'white',
          zIndex: 100,
          minWidth: '280px',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
          animation: 'slide-down 0.3s ease-out forwards'
        }}>
          <button 
            onClick={() => setSelectedPoint(null)}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: selectedPoint.color }}></div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedPoint.label}</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enlem: {selectedPoint.lat.toFixed(2)} | Boylam: {selectedPoint.lng.toFixed(2)}</p>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.4)', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 600 }}>Son Durum</span>
            <p style={{ marginTop: '0.25rem', fontSize: '0.95rem' }}>{selectedPoint.news}</p>
          </div>
        </div>
      )}
    </div>
  );
};
