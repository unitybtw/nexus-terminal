import React, { useState, useEffect } from 'react';
import { WorldMap2D } from './components/WorldMap2D';
import { TickerBar } from './components/TickerBar';

const ALL_NEWS_POOL = [
  { time: '', tag: 'Alert', text: 'Tech sector sees sharp selloff; Semiconductor index drops 2.4% in early trading.', isAlert: true },
  { time: '', tag: 'Crypto', text: 'Bitcoin surges past $65K resistance level amid institutional accumulation reports.', isAlert: false },
  { time: '', tag: 'Energy', text: 'Oil prices rise to 3-month high after sudden supply chain disruptions.', isAlert: true },
  { time: '', tag: 'Macro', text: 'ECB announces unexpected interest rate hold, citing resilient inflation data.', isAlert: false },
  { time: '', tag: 'Earnings', text: 'Apple beats Q3 estimates, services revenue up 14% year-over-year.', isAlert: false },
  { time: '', tag: 'Geo', text: 'New trade tariffs announced in Southeast Asia, impacting global shipping routes.', isAlert: true }
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState<any>(null);
  
  // Simulated dynamic index values
  const [indices, setIndices] = useState([
    { name: 'S&P 500', value: 5137.08, change: 1.2, isPos: true },
    { name: 'NASDAQ', value: 16274.94, change: -0.4, isPos: false },
    { name: 'BIST 100', value: 9155.32, change: 2.1, isPos: true },
    { name: 'FTSE 100', value: 7682.50, change: 0.8, isPos: true }
  ]);

  // Simulated dynamic news
  const [news, setNews] = useState(() => {
    return ALL_NEWS_POOL.slice(0, 3).map(n => ({
      ...n,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update indices slightly every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(ind => {
        const volatility = (Math.random() - 0.5) * 5;
        const newValue = ind.value + volatility;
        return { ...ind, value: parseFloat(newValue.toFixed(2)) };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Push new news every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(prev => {
        const randomNews = ALL_NEWS_POOL[Math.floor(Math.random() * ALL_NEWS_POOL.length)];
        const newItem = {
          ...randomNews,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
        const newFeed = [newItem, ...prev].slice(0, 15);
        return newFeed;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background dark:bg-background text-primary dark:text-primary font-body-md text-body-md">
      {/* TickerBar (Restored) */}
      <TickerBar />

      {/* TopNavBar (Adjusted for TickerBar) */}
      <nav className="fixed top-10 w-full z-40 border-b border-border-subtle flex justify-between items-center h-16 px-gutter bg-background max-w-full">
        {/* Logo */}
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
          NEXUS
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-lg">
          <a className="text-primary border-b-2 border-primary pb-2 font-label-md text-label-md hover:bg-surface-variant/10" href="#">Radar</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:bg-surface-variant/10" href="#">Markets</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:bg-surface-variant/10" href="#">News</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:bg-surface-variant/10" href="#">Portfolio</a>
        </div>

        {/* Search & Right Actions */}
        <div className="flex items-center gap-md">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input className="bg-transparent border border-border-subtle rounded-DEFAULT py-[6px] pl-10 pr-4 text-body-sm font-body-sm text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary w-64 transition-colors" placeholder="Search markets, news, or assets..." type="text"/>
          </div>
          <div className="font-mono-data text-mono-data text-on-surface-variant hidden sm:block">
            {formatTime(currentTime)} UTC
          </div>
          <div className="flex items-center gap-sm">
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-DEFAULT hover:bg-surface-variant/10 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-DEFAULT hover:bg-surface-variant/10">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <main className="flex-1 mt-[104px] pt-lg px-gutter pb-lg grid grid-cols-1 lg:grid-cols-12 gap-xl h-[calc(100vh-104px)] overflow-hidden">
        
        {/* Left Column: Markets Overview */}
        <section className="lg:col-span-3 flex flex-col h-full">
          <header className="border-b border-border-subtle pb-sm mb-md flex justify-between items-end">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase">Markets Overview</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] hover:text-primary cursor-pointer transition-colors">more_horiz</span>
          </header>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-md">
            {indices.map((ind, i) => (
              <React.Fragment key={ind.name}>
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-baseline mb-xs">
                    <span className="font-body-md text-body-md font-semibold text-primary">{ind.name}</span>
                    <span className={`font-mono-data text-mono-data ${ind.isPos ? 'text-positive' : 'text-negative'}`}>
                      {ind.isPos ? '+' : ''}{ind.change}%
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-sm">
                    <span className="font-mono-data text-mono-data text-on-surface-variant">{ind.value.toLocaleString()}</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant text-[12px]">
                      {ind.isPos ? '+' : ''}{(ind.value * 0.012).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-8 w-full relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                      {ind.isPos ? (
                        <>
                          <path className="sparkline" d="M0,15 L10,12 L20,18 L30,10 L40,14 L50,8 L60,11 L70,5 L80,7 L90,2 L100,0" fill="none" stroke="#4ade80" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                          <path d="M0,15 L10,12 L20,18 L30,10 L40,14 L50,8 L60,11 L70,5 L80,7 L90,2 L100,0 L100,20 L0,20 Z" fill="url(#positiveGradient)" opacity="0.1"></path>
                        </>
                      ) : (
                        <>
                          <path className="sparkline" d="M0,5 L10,8 L20,4 L30,12 L40,9 L50,15 L60,13 L70,18 L80,14 L90,19 L100,20" fill="none" stroke="#f87171" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                          <path d="M0,5 L10,8 L20,4 L30,12 L40,9 L50,15 L60,13 L70,18 L80,14 L90,19 L100,20 L100,20 L0,20 Z" fill="url(#negativeGradient)" opacity="0.1"></path>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
                {i < indices.length - 1 && <div className="w-full h-px bg-border-subtle opacity-50"></div>}
              </React.Fragment>
            ))}
          </div>

          <svg aria-hidden="true" focusable="false" style={{ width:0, height:0, position:'absolute' }}>
            <defs>
              <linearGradient id="positiveGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </section>

        {/* Center Area: Global Radar (Map) */}
        <section className="lg:col-span-6 flex flex-col h-full relative border-x border-border-subtle px-xl overflow-hidden">
          <header className="flex justify-between items-center mb-md absolute top-0 left-xl right-xl z-20">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Global Radar</h2>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-primary pulse-dot"></span>
              <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase">Live Feed Active</span>
            </div>
          </header>
          
          <div className="flex-1 w-full h-full relative -mx-xl px-xl flex items-center justify-center mt-8">
            <WorldMap2D onPointClick={setSelectedCity} />
            {selectedCity && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border-subtle p-md min-w-64 shadow-2xl z-50">
                <div className="flex justify-between items-center mb-sm border-b border-border-subtle pb-xs">
                  <h3 className="font-body-md font-semibold">{selectedCity.name}</h3>
                  <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-negative" onClick={() => setSelectedCity(null)}>close</span>
                </div>
                <div className="font-label-md text-on-surface-variant mb-2">Sector: {selectedCity.type.toUpperCase()}</div>
                <div className="font-mono-data text-xs text-on-surface-variant">Live updates streaming...</div>
              </div>
            )}
          </div>

          {/* Bottom Data Overlay */}
          <div className="absolute bottom-lg left-xl right-xl border-t border-border-subtle pt-sm flex justify-between z-20 bg-background/80 backdrop-blur">
            <div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Global Volume</div>
              <div className="font-mono-data text-body-lg text-primary">2.4T <span className="text-[12px] text-on-surface-variant">USD</span></div>
            </div>
            <div className="text-right">
              <div className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Volatility Index</div>
              <div className="font-mono-data text-body-lg text-negative">14.28 <span className="text-[12px] text-on-surface-variant">VIX</span></div>
            </div>
          </div>
        </section>

        {/* Right Column: Live Events & News */}
        <section className="lg:col-span-3 flex flex-col h-full">
          <header className="border-b border-border-subtle pb-sm mb-md flex justify-between items-end">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase">Live Events & News</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] hover:text-primary cursor-pointer transition-colors">filter_list</span>
          </header>

          <div className="flex-1 overflow-y-auto pr-2 space-y-lg">
            {news.map((n, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="flex items-center gap-xs mb-1">
                  <span className="font-mono-data text-mono-data text-on-surface-variant text-[11px]">{n.time}</span>
                  <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                  <span className={`font-label-md text-label-md text-[10px] uppercase border px-1 rounded-sm ${n.isAlert ? 'text-negative border-negative/30' : 'text-primary border-border-subtle'}`}>
                    {n.tag}
                  </span>
                </div>
                <h3 className={`font-body-md text-body-md transition-colors leading-snug ${n.isAlert ? 'text-negative' : 'text-primary group-hover:opacity-80'}`}>
                  {n.text}
                </h3>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
