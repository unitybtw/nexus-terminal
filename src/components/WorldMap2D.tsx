import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import type { MapEvent } from '../core/simulator';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface WorldMap2DProps {
  events?: MapEvent[];
}

export function WorldMap2D({ events = [] }: WorldMap2DProps) {
  const [activeEvent, setActiveEvent] = useState<MapEvent | null>(null);

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projectionConfig={{
          scale: 160,
          center: [0, 10]
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b" // slate-800
                stroke="#334155" // slate-700
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                  pressed: { fill: "#1e293b", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {events.map((evt) => (
          <Marker 
            key={evt.id} 
            coordinates={[evt.lon, evt.lat]}
            onClick={() => setActiveEvent(evt)}
            className="cursor-pointer"
          >
            <circle r={evt.magnitude} fill="#ef4444" opacity={0.6} className="animate-ping" />
            <circle r={evt.magnitude / 2} fill="#ef4444" />
          </Marker>
        ))}
      </ComposableMap>

      {/* Modern Pop-up / Tooltip */}
      {activeEvent && (
        <div className="absolute top-10 right-10 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-[#121826]/90 backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-2xl w-64">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-red-400 tracking-wider">SEISMIC ALERT</span>
              </div>
              <button 
                onClick={() => setActiveEvent(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <h3 className="text-white font-medium text-sm leading-snug mb-3">
              {activeEvent.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50">
                <span className="text-slate-400 block mb-1">Magnitude</span>
                <span className="text-white font-mono">{activeEvent.magnitude.toFixed(1)}</span>
              </div>
              <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50">
                <span className="text-slate-400 block mb-1">Time</span>
                <span className="text-white font-mono">{activeEvent.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
