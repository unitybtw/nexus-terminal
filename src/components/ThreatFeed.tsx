import React, { useRef } from 'react';
import type { ThreatItem } from '../core/simulator';
import { ShieldAlert, Shield, ShieldQuestion } from 'lucide-react';

interface ThreatFeedProps {
  threats: ThreatItem[];
}

export const ThreatFeed: React.FC<ThreatFeedProps> = ({ threats }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 border-red-500/30 bg-red-500/10';
      case 'high': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
      default: return 'text-slate-500 border-slate-500/30 bg-slate-500/10';
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert size={16} className="text-red-500 animate-pulse" />;
      case 'high': return <ShieldAlert size={16} className="text-orange-500" />;
      case 'medium': return <Shield size={16} className="text-yellow-500" />;
      default: return <ShieldQuestion size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden">
      <header className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
        <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot"></span>
          Cyber Threat Intel
        </h3>
        <span className="font-mono text-[10px] text-slate-500">LIVE SENSOR FEED</span>
      </header>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {threats.map((threat) => (
          <div 
            key={threat.id} 
            className={`border rounded-lg p-3 flex flex-col gap-2 transition-all duration-300 animate-in slide-in-from-right-4 fade-in ${getSeverityColor(threat.severity)}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getIcon(threat.severity)}
                <span className="font-mono text-xs font-bold uppercase">{threat.type}</span>
              </div>
              <span className="font-mono text-[10px] opacity-70">{threat.time}</span>
            </div>
            
            <div className="flex justify-between items-end font-mono text-[11px]">
              <div>
                <div className="opacity-60 mb-1">SRC: {threat.sourceIp}</div>
                <div className="opacity-60">DST: {threat.targetRegion}</div>
              </div>
              <div className="uppercase font-bold tracking-wider opacity-90">
                {threat.severity}
              </div>
            </div>
          </div>
        ))}

        {threats.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm animate-pulse">
            Scanning for anomalies...
          </div>
        )}
      </div>
    </div>
  );
};
