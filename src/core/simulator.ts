import WebSocket from 'isomorphic-ws';

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  isPos: boolean;
  history: { time: string; price: number }[];
}

export interface NewsItem {
  time: string;
  tag: string;
  text: string;
  isAlert: boolean;
}

export interface MapEvent {
  id: string;
  lon: number;
  lat: number;
  title: string;
  magnitude: number;
  time: string;
}

// Initial state before socket connects
export const INITIAL_INDICES: MarketIndex[] = [
  { name: 'BTC/USDT', value: 0, change: 0, isPos: true, history: [] },
  { name: 'ETH/USDT', value: 0, change: 0, isPos: true, history: [] },
  { name: 'BNB/USDT', value: 0, change: 0, isPos: true, history: [] },
  { name: 'SOL/USDT', value: 0, change: 0, isPos: true, history: [] }
];

export class NexusSimulator {
  private indices: MarketIndex[];
  private news: NewsItem[];
  private mapEvents: MapEvent[];
  private ws: WebSocket | null = null;
  private newsInterval: NodeJS.Timeout | null = null;
  private mapInterval: NodeJS.Timeout | null = null;
  
  public onMarketUpdate: ((indices: MarketIndex[]) => void) | null = null;
  public onNewsUpdate: ((news: NewsItem[]) => void) | null = null;
  public onMapUpdate: ((events: MapEvent[]) => void) | null = null;

  constructor() {
    this.indices = [...INITIAL_INDICES];
    this.news = [];
    this.mapEvents = [];
  }

  private getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  public start() {
    this.connectBinance();
    this.fetchNews();
    this.fetchMapEvents();
    
    // Refresh news every 60 seconds
    this.newsInterval = setInterval(() => {
      this.fetchNews();
    }, 60000);

    // Refresh earthquakes every 5 minutes
    this.mapInterval = setInterval(() => {
      this.fetchMapEvents();
    }, 300000);
  }

  private connectBinance() {
    const streams = ['btcusdt@ticker', 'ethusdt@ticker', 'bnbusdt@ticker', 'solusdt@ticker'];
    const url = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;
    
    // We use isomorphic-ws which works in both Node and Browser
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data.toString());
      
      if (data && data.s && data.c && data.P) {
        const symbol = data.s; // e.g. BTCUSDT
        const price = parseFloat(data.c);
        const changePercent = parseFloat(data.P);
        
        const formattedName = `${symbol.replace('USDT', '')}/USDT`;
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
        
        const index = this.indices.findIndex(i => i.name === formattedName);
        if (index !== -1) {
          // Throttle history updates to 1 per second per asset
          const lastPoint = this.indices[index].history[this.indices[index].history.length - 1];
          const newHistory = [...this.indices[index].history];
          if (!lastPoint || lastPoint.time !== timeStr) {
            newHistory.push({ time: timeStr, price: price });
            if (newHistory.length > 50) newHistory.shift();
          }

          this.indices[index] = {
            name: formattedName,
            value: price,
            change: changePercent,
            isPos: changePercent >= 0,
            history: newHistory
          };
          
          if (this.onMarketUpdate) {
            this.onMarketUpdate([...this.indices]);
          }
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('Binance WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      // Reconnect after 5 seconds if disconnected
      setTimeout(() => this.connectBinance(), 5000);
    };
  }

  private async fetchNews() {
    try {
      // BBC World News RSS feed converted to JSON via public API
      const rssUrl = encodeURIComponent('http://feeds.bbci.co.uk/news/world/rss.xml');
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
      const data = await response.json();

      if (data && data.status === 'ok' && data.items) {
        const newNews: NewsItem[] = data.items.slice(0, 15).map((item: any) => {
          // Add a bit of randomness for "Alert" tags
          const isAlert = Math.random() > 0.8; 
          
          // Parse date or use current time
          const dateObj = new Date(item.pubDate);
          const timeString = isNaN(dateObj.getTime()) ? this.getCurrentTime() : dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return {
            time: timeString,
            tag: isAlert ? 'Alert' : 'Global',
            text: item.title,
            isAlert: isAlert
          };
        });

        this.news = newNews;
        if (this.onNewsUpdate) {
          this.onNewsUpdate(this.news);
        }
      }
    } catch (error) {
      console.error('Failed to fetch RSS news:', error);
    }
  }

  private async fetchMapEvents() {
    try {
      // Fetch earthquakes from USGS API (M4.5+)
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
      const data = await response.json();

      if (data && data.features) {
        const newEvents: MapEvent[] = data.features.slice(0, 50).map((feature: any) => {
          const dateObj = new Date(feature.properties.time);
          return {
            id: feature.id,
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            title: feature.properties.title,
            magnitude: feature.properties.mag,
            time: dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        });

        this.mapEvents = newEvents;
        if (this.onMapUpdate) {
          this.onMapUpdate(this.mapEvents);
        }
      }
    } catch (error) {
      console.error('Failed to fetch USGS events:', error);
    }
  }

  public stop() {
    if (this.ws) {
      this.ws.close();
    }
    if (this.newsInterval) {
      clearInterval(this.newsInterval);
    }
    if (this.mapInterval) {
      clearInterval(this.mapInterval);
    }
  }

  public getIndices() {
    return this.indices;
  }

  public getNews() {
    return this.news;
  }

  public getMapEvents() {
    return this.mapEvents;
  }
}
