# NEXUS Terminal 🌍📈

> A Minimal Premium Global Command Center built with React, Vite, and Node.js. Now featuring a Dual-Interface Architecture (Web UI & Hacker TUI) powered by 100% Real-Time Data.

NEXUS Terminal is an open-source dashboard designed to monitor global financial markets, breaking news, and worldwide physical events (earthquakes) in real-time. It features a stunning "Dark Slate" (Apple/Stripe style) aesthetic for the Web, and a hardcore ASCII interface for the Terminal.

## ✨ Key Features

- **Hybrid Architecture (Web & TUI)**: Run the beautifully designed React Web UI or drop into the Matrix with the `blessed-contrib` ASCII Terminal UI. Both interfaces run on the same core data engine.
- **Real-Time Crypto Markets**: Live WebSocket connection to Binance streams real-time prices and 24h volatility for major assets (BTC, ETH, BNB, SOL).
- **Global Seismic Radar (USGS)**: The interactive 2D Map is hooked into the US Geological Survey API, tracking live M4.5+ earthquakes globally.
- **Breaking News Engine**: Connects to BBC World News via RSS, pushing critical global alerts into the dashboard.
- **Sci-Fi Audio Engine**: A zero-dependency Web Audio API integration that plays subtle sci-fi interface sounds (deep rumbles for earthquakes, warning chimes for news alerts).
- **Interactive Data Visualization**: Glassmorphism pop-up modals with historical line charts (via `recharts`) in the Web UI, and live ASCII bar/line charts in the TUI.

## 🚀 Tech Stack

- **Core Engine**: Node.js, `isomorphic-ws`, `rss2json`
- **Web UI**: React 18 + Vite, Tailwind CSS V4, `react-simple-maps`, `recharts`, `lucide-react`
- **Terminal UI (TUI)**: `blessed`, `blessed-contrib`, `tsx`
- **Fonts**: Inter (UI) & JetBrains Mono (Data)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/unitybtw/nexus-terminal.git
   cd nexus-terminal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🎮 How to Run

NEXUS Terminal offers two distinct experiences. Run the one that fits your mood:

### 1. The Premium Web UI
A sleek, modern, web-based command center.
```bash
npm run dev:web
```
*Opens at `http://localhost:5173`*

### 2. The Hacker Terminal (TUI)
A hardcore, terminal-only dashboard with ASCII maps and live charts.
```bash
npm run dev:tui
```

## 🎨 Design Philosophy

NEXUS Terminal embraces a **"Minimal Premium"** aesthetic. It completely drops heavy neon colors in favor of a **Dark Slate** background and strict, 1px borders. It aims for the look and feel of a next-generation Bloomberg Terminal combined with a cinematic crisis command center.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open-source and available under the MIT License.
