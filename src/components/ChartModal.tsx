import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { MarketIndex } from '../core/simulator';
import { uiAudio } from '../core/audio';

interface ChartModalProps {
  data: MarketIndex | null;
  onClose: () => void;
}

export function ChartModal({ data, onClose }: ChartModalProps) {
  useEffect(() => {
    if (data) {
      uiAudio.playOpen();
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121826] border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800/50">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">{data.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xl text-slate-300 font-mono">${data.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${data.isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {data.isPos ? '+' : ''}{data.change.toFixed(2)}%
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Chart Area */}
        <div className="p-6 h-[400px] w-full">
          {data.history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickMargin={10}
                  tickFormatter={(val) => val.split(':').slice(1).join(':')} // mm:ss
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#475569" 
                  fontSize={12}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={data.isPos ? '#34d399' : '#fb7185'} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4, fill: '#fff' }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Awaiting live data stream...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
