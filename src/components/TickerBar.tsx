import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import React from 'react';

const mockData = [
  { symbol: 'S&P 500', value: '5,123.45', change: '+1.2%', isUp: true },
  { symbol: 'NASDAQ', value: '16,234.12', change: '+1.5%', isUp: true },
  { type: 'news', text: 'SON DAKİKA: Merkez Bankası faiz kararını açıkladı.' },
  { symbol: 'BIST 100', value: '9,876.54', change: '-0.4%', isUp: false },
  { symbol: 'GOLD', value: '$2,145.30', change: '+0.8%', isUp: true },
  { type: 'news', text: 'Teknoloji devleri yeni çip üretim tesisleri kuruyor.' },
  { symbol: 'BTC/USD', value: '$68,450.00', change: '+4.2%', isUp: true },
  { symbol: 'EUR/USD', value: '1.0920', change: '-0.1%', isUp: false },
  { type: 'news', text: 'Küresel iklim zirvesi yarın başlıyor.' },
];

export const TickerBar: React.FC = () => {
  return (
    <div className="w-full border-b border-border-subtle overflow-hidden bg-background h-10 flex items-center z-50 fixed top-0">
      <div className="flex animate-ticker whitespace-nowrap items-center">
        {[...mockData, ...mockData, ...mockData].map((item, index) => (
          <div key={index} className="flex items-center pr-xl">
            {item.type === 'news' ? (
              <div className="flex items-center gap-xs">
                <Activity size={14} className="text-on-surface-variant" />
                <span className="text-primary font-body-sm tracking-wide">{item.text}</span>
              </div>
            ) : (
              <div className="flex items-center gap-sm">
                <span className="text-on-surface-variant font-label-md tracking-wider uppercase">{item.symbol}</span>
                <span className="text-primary font-mono-data text-[13px]">{item.value}</span>
                <span className={`flex items-center gap-1 font-mono-data text-[12px] ${item.isUp ? 'text-positive' : 'text-negative'}`}>
                  {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.change}
                </span>
              </div>
            )}
            <div className="w-1 h-1 rounded-full bg-border-subtle ml-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
