import blessed from 'blessed';
// @ts-ignore
import contrib from 'blessed-contrib';
import { NexusSimulator } from '../core/simulator';
import type { MarketIndex, NewsItem, MapEvent } from '../core/simulator';

const screen = blessed.screen({
  smartCSR: true,
  title: 'NEXUS Terminal TUI'
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// 1. Map (Top Left)
const map = grid.set(0, 0, 6, 6, contrib.map, {
  label: 'Global Seismic Radar (M4.5+)',
  style: { shapeColor: 'cyan' }
});

// 2. Bar Chart (Top Middle)
const barChart = grid.set(0, 6, 6, 3, contrib.bar, {
  label: 'Volatility (%)',
  barWidth: 4,
  barSpacing: 2,
  xOffset: 1,
  maxHeight: 15
});

// 3. Market Table (Top Right)
const marketTable = grid.set(0, 9, 6, 3, contrib.table, {
  keys: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'blue',
  interactive: true,
  label: 'Markets Overview',
  width: '100%',
  height: '100%',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 2,
  columnWidth: [12, 10, 8]
});

// 3. Line Chart for BTC/USDT (Middle Full Width)
const lineChart = grid.set(6, 0, 3, 12, contrib.line, {
  style: { line: "yellow", text: "green", baseline: "black" },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false, // Allows decimal prices
  label: 'BTC/USDT Live Action'
});

// 4. Log for News (Bottom Full Width)
const newsLog = grid.set(9, 0, 3, 12, contrib.log, {
  fg: 'green',
  selectedFg: 'green',
  label: 'Live Events & News',
  border: { type: 'line', fg: 'cyan' }
});

screen.key(['escape', 'q', 'C-c'], function(_ch: any, _key: any) {
  return process.exit(0);
});

const simulator = new NexusSimulator();

// State to hold history for the line chart
const btcHistory = {
  title: 'BTC',
  x: [] as string[],
  y: [] as number[],
  style: { line: 'yellow' }
};

let lastChartUpdate = 0;

simulator.onMarketUpdate = (indices: MarketIndex[]) => {
  // Update Table
  const data = indices.map(ind => [
    ind.name,
    ind.value.toFixed(2),
    `${ind.isPos ? '+' : ''}${ind.change.toFixed(2)}%`
  ]);
  
  marketTable.setData({
    headers: ['Asset', 'Price', 'Chg'],
    data: data
  });

  // Update Bar Chart
  barChart.setData({
    titles: indices.map(i => i.name.split('/')[0]),
    data: indices.map(i => Math.abs(i.change))
  });

  // Update Line Chart (throttle to max 1 data point per second)
  const now = Date.now();
  if (now - lastChartUpdate > 1000) {
    const btcData = indices.find(i => i.name === 'BTC/USDT');
    if (btcData && btcData.value > 0) {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
      
      btcHistory.x.push(timeStr);
      btcHistory.y.push(btcData.value);

      // Keep only the last 40 data points
      if (btcHistory.x.length > 40) {
        btcHistory.x.shift();
        btcHistory.y.shift();
      }

      lineChart.setData([btcHistory]);
      lastChartUpdate = now;
    }
  }

  screen.render();
};

let lastNewsTime = '';

simulator.onNewsUpdate = (news: NewsItem[]) => {
  if (news.length > 0) {
    const latest = news[0];
    if (latest.time !== lastNewsTime) {
      const color = latest.isAlert ? 'red' : 'white';
      newsLog.log(`{${color}-fg}[${latest.time}] [${latest.tag}] ${latest.text}{/${color}-fg}`);
      lastNewsTime = latest.time;
      screen.render();
    }
  }
};

simulator.onMapUpdate = (events: MapEvent[]) => {
  // @ts-ignore
  if (map.clearMarkers) map.clearMarkers();
  
  events.forEach(evt => {
    // @ts-ignore
    map.addMarker({
      "lon": evt.lon,
      "lat": evt.lat,
      color: "red",
      char: "X"
    });
  });
  screen.render();
};

simulator.start();
screen.render();