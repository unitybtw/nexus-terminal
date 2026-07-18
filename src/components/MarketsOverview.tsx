import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';
import { MarketIndex } from '../core/simulator';

interface MarketsOverviewProps {
  indices: MarketIndex[];
  onSelectMarket: (index: MarketIndex) => void;
}

export const MarketsOverview: React.FC<MarketsOverviewProps> = ({ indices, onSelectMarket }) => {
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
