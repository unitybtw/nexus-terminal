import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMap2DProps {
  onPointClick: (point: any) => void;
}

export const WorldMap2D: React.FC<WorldMap2DProps> = ({ onPointClick }) => {
  const markers = [
    { name: "New York", coordinates: [-74.006, 40.7128], type: 'finance' },
    { name: "London", coordinates: [-0.1276, 51.5074], type: 'finance' },
    { name: "Tokyo", coordinates: [139.6917, 35.6895], type: 'tech' },
    { name: "Istanbul", coordinates: [28.9784, 41.0082], type: 'emerging' },
    { name: "Dubai", coordinates: [55.2708, 25.2048], type: 'energy' },
    { name: "Singapore", coordinates: [103.8198, 1.3521], type: 'finance' }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b" /* Tailwind border-subtle / slate-800 */
                stroke="#334155" /* Tailwind slate-700 */
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none", cursor: "pointer" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>

        {markers.map((marker) => (
          <Marker 
            key={marker.name} 
            coordinates={marker.coordinates as [number, number]} 
            onClick={() => onPointClick(marker)}
          >
            <circle
              r={4}
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth={2}
              className="cursor-pointer transition-all hover:scale-150"
            />
            {/* Pulse effect circle */}
            <circle
              r={12}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1}
              className="pulse-dot pointer-events-none"
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};
