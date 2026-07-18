import blessed from 'blessed';
// @ts-ignore
import contrib from 'blessed-contrib';
import { NexusSimulator, MarketIndex, NewsItem } from '../core/simulator';

const screen = blessed.screen({
  smartCSR: true,
  title: 'NEXUS Terminal TUI'
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// 1. Map (Top Left)
const map = grid.set(0, 0, 6, 8, contrib.map, {
  label: 'Global Radar',
  style: { shapeColor: 'cyan' }
});

map.addMarker({ "lon": "-74.006", "lat": "40.7128", color: "red", char: "X" }); // NY
map.addMarker({ "lon": "-0.1276", "lat": "51.5074", color: "yellow", char: "X" }); // London
map.addMarker({ "lon": "139.6917", "lat": "35.6895", color: "magenta", char: "X" }); // Tokyo
map.addMarker({ "lon": "28.9784", "lat": "41.0082", color: "green", char: "X" }); // Istanbul

// 2. Market Table (Top Right)
const marketTable = grid.set(0, 8, 6, 4, contrib.table, {
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

screen.key(['escape', 'q', 'C-c'], function(ch: any, key: any) {
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
    headers: ['Index', 'Value', 'Change'],
    data: data
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

simulator.start();
screen.render();