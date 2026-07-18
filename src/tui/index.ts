import blessed from 'blessed';
import os from 'os';
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

const cpuSpark = grid.set(6, 0, 2, 4, contrib.sparkline, {
  label: ' CPU Core Load ',
  tags: true,
  style: { fg: 'green' }
});

const ramDonut = grid.set(6, 4, 2, 4, contrib.donut, {
  label: ' Memory Usage ',
  radius: 8,
  arcWidth: 3,
  remainColor: 'black',
  yPadding: 2
});

// 3. Line Chart for BTC/USDT (Middle Full Width)
const lineChart = grid.set(8, 0, 4, 8, contrib.line, {
  style: { line: "yellow", text: "green", baseline: "black" },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false, // Allows decimal prices
  label: ' BTC/USDT Price (Live) '
});

// 4. Log for News (Bottom Full Width)
const newsLog = grid.set(8, 8, 4, 4, contrib.log, {
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

const cpuData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
setInterval(() => {
  // RAM
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramPercent = Math.round((usedMem / totalMem) * 100);
  
  ramDonut.setData([
    {percent: ramPercent, label: 'RAM', color: ramPercent > 80 ? 'red' : 'magenta'}
  ]);

  // CPU (Simulated dynamic load based on loadavg for dramatic effect)
  const baseLoad = os.loadavg()[0] * 10;
  const jitter = Math.random() * 20 - 10; 
  let currentCpu = Math.max(0, Math.min(100, Math.round(baseLoad + jitter)));
  
  cpuData.shift();
  cpuData.push(currentCpu);
  
  cpuSpark.setData(
    ['CPU'],
    [cpuData]
  );
  
  screen.render();
}, 1000);

simulator.start();
screen.render();