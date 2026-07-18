import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { MarketIndex } from '../core/simulator';

interface PortfolioProps {
  indices: MarketIndex[];
}

// Simulated User Holdings
const HOLDINGS: Record<string, { amount: number, color: string }> = {
  'BTC/USDT': { amount: 0.45, color: '#f59e0b' },  // Amber
  'ETH/USDT': { amount: 12.5, color: '#6366f1' },  // Indigo
  'BNB/USDT': { amount: 50.0, color: '#eab308' },  // Yellow
  'SOL/USDT': { amount: 150.0, color: '#14b8a6' }, // Teal
};

export const Portfolio: React.FC<PortfolioProps> = ({ indices }) => {
  
  // Calculate live values
  const assets = Object.keys(HOLDINGS).map(ticker => {
    const market = indices.find(i => i.name === ticker);
    const price = market ? market.value : 0;
    const value = price * HOLDINGS[ticker].amount;
    
    return {
      ticker,
      amount: HOLDINGS[ticker].amount,
      price,
      value,
      color: HOLDINGS[ticker].color,
      isPos: market ? market.isPos : true,
      change: market ? market.change : 0
    };
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // Data for Donut Chart
  const pieData = assets.map(a => ({
    name: a.ticker.split('/')[0],
    value: a.value,
    color: a.color
  })).filter(a => a.value > 0);

  return (
    <div className="w-full h-full flex flex-col p-4 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Portfolio Header */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-slate-400 font-mono text-sm uppercase tracking-widest mb-1">Total Net Worth</h2>
          <div className="text-4xl font-bold text-white font-mono flex items-center gap-4">
            ${totalValue > 0 ? totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
            <span className="text-sm font-sans bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
              LIVE
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert("Smart Contract Integration Pending...")} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-md font-mono text-sm transition-colors">
            DEPOSIT
          </button>
          <button onClick={() => alert("Smart Contract Integration Pending...")} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-md font-mono text-sm transition-colors">
            WITHDRAW
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left Side: Chart */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 relative">
          <h3 className="absolute top-4 left-4 text-slate-400 font-mono text-xs uppercase">Allocation</h3>
          {totalValue > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 animate-pulse">Syncing Blockchain Data...</div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-slate-500 font-mono text-xs">ASSETS</span>
            <span className="text-white font-bold text-xl">{pieData.length}</span>
          </div>
        </div>

        {/* Right Side: Asset List */}
        <div className="space-y-3 overflow-y-auto pr-2">
          <h3 className="text-slate-400 font-mono text-xs uppercase mb-4">Holdings</h3>
          {assets.map(asset => (
            <div key={asset.ticker} className="bg-slate-900/40 hover:bg-slate-800/60 transition-colors border border-slate-800 rounded-lg p-4 flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: asset.color }}></div>
                <div>
                  <div className="text-white font-bold text-lg">{asset.ticker.split('/')[0]}</div>
                  <div className="text-slate-400 font-mono text-sm">{asset.amount} {asset.ticker.split('/')[0]}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-lg">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`font-mono text-sm ${asset.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {asset.isPos ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
