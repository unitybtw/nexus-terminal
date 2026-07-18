import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const initialMarkets = [
  { name: 'S&P 500', region: 'ABD', value: 5123.45, change: 1.25, points: 63.20, isUp: true },
  { name: 'NASDAQ', region: 'ABD', value: 16234.12, change: 1.50, points: 239.88, isUp: true },
  { name: 'DOW JONES', region: 'ABD', value: 38990.23, change: -0.15, points: -58.42, isUp: false },
  { name: 'FTSE 100', region: 'Avrupa', value: 7689.44, change: 0.40, points: 30.64, isUp: true },
  { name: 'DAX', region: 'Avrupa', value: 17800.11, change: 0.85, points: 150.12, isUp: true },
  { name: 'NIKKEI 225', region: 'Asya', value: 39120.00, change: -1.10, points: -434.90, isUp: false },
  { name: 'HANG SENG', region: 'Asya', value: 16500.50, change: 2.10, points: 339.42, isUp: true },
  { name: 'BIST 100', region: 'Türkiye', value: 9876.54, change: -0.40, points: -39.50, isUp: false },
];

export const MarketsOverview: React.FC = () => {
  const [markets, setMarkets] = useState(initialMarkets);

  useEffect(() => {
    // Simulate live market data fluctuations every 2 seconds
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(market => {
        const volatility = market.value * 0.001; // 0.1% volatility
        const changeAmount = (Math.random() - 0.5) * volatility;
        const newValue = market.value + changeAmount;
        const newChange = market.change + (changeAmount / market.value) * 100;
        const newPoints = market.points + changeAmount;
        
        return {
          ...market,
          value: newValue,
          change: newChange,
          points: newPoints,
          isUp: newChange >= 0
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="flex-center" style={{ gap: '0.5rem', fontSize: '1.25rem' }}>
          <LineChart className="text-gradient" /> Piyasalar
        </h2>
        <span className="live-indicator"></span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {markets.map((market, i) => (
            <div key={i} style={{ 
              padding: '1rem', 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '0.75rem',
              border: `1px solid ${market.isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              transition: 'all 0.3s ease'
            }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{market.region}</span>
                {market.isUp ? 
                  <TrendingUp size={14} color="var(--accent-green)" /> : 
                  <TrendingDown size={14} color="var(--accent-red)" />
                }
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{market.name}</div>
              <div style={{ 
                fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace',
                color: market.isUp ? 'var(--text-primary)' : 'var(--text-primary)'
              }}>
                {formatNumber(market.value)}
              </div>
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem',
                color: market.isUp ? 'var(--accent-green)' : 'var(--accent-red)',
                fontSize: '0.875rem', fontWeight: 500
              }}>
                <span>{market.points > 0 ? '+' : ''}{formatNumber(market.points)}</span>
                <span>{market.change > 0 ? '+' : ''}{formatNumber(market.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
