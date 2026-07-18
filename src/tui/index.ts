import blessed from 'blessed';
// @ts-ignore
import contrib from 'blessed-contrib';
import { NexusSimulator, MarketIndex, NewsItem } from '../core/simulator';

const screen = blessed.screen({
  smartCSR: true,
  title: 'NEXUS Terminal TUI'
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// Map
const map = grid.set(0, 0, 8, 8, contrib.map, {
  label: 'Global Radar',
  style: { shapeColor: 'cyan' }
});

// Markers
map.addMarker({ "lon": "-74.006", "lat": "40.7128", color: "red", char: "X" }); // NY
map.addMarker({ "lon": "-0.1276", "lat": "51.5074", color: "yellow", char: "X" }); // London
map.addMarker({ "lon": "139.6917", "lat": "35.6895", color: "magenta", char: "X" }); // Tokyo
map.addMarker({ "lon": "28.9784", "lat": "41.0082", color: "green", char: "X" }); // Istanbul

// Market Table
const marketTable = grid.set(0, 8, 8, 4, contrib.table, {
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

// Log for News
const newsLog = grid.set(8, 0, 4, 12, contrib.log, {
  fg: 'green',
  selectedFg: 'green',
  label: 'Live Events & News',
  border: { type: 'line', fg: 'cyan' }
});

screen.key(['escape', 'q', 'C-c'], function(ch: any, key: any) {
  return process.exit(0);
});

const simulator = new NexusSimulator();

simulator.onMarketUpdate = (indices: MarketIndex[]) => {
  const data = indices.map(ind => [
    ind.name,
    ind.value.toFixed(2),
    `${ind.isPos ? '+' : ''}${ind.change.toFixed(2)}%`
  ]);
  
  marketTable.setData({
    headers: ['Index', 'Value', 'Change'],
    data: data
  });
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
