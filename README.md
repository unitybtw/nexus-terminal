# NEXUS Terminal 🌍📈

> A Minimal Premium Global Command Center built with React, Vite, Tailwind CSS V4, and react-simple-maps.

NEXUS Terminal is an open-source dashboard designed to monitor global financial markets, breaking news, and worldwide events in real-time. It features a stunning "Dark Slate" (Apple/Stripe style) aesthetic, a dynamic 2D vector world map, and an infinite-scrolling ticker bar.

## ✨ Features

- **Live Market Data Simulation**: Real-time simulated fluctuations of major indices (S&P 500, NASDAQ, BIST 100) with dynamic SVG sparklines.
- **Interactive 2D World Map**: A sleek, dark-themed vector map using `react-simple-maps`. Important financial hubs pulse and provide regional data upon interaction.
- **Dynamic News & Events Feed**: An automated feed that injects breaking news alerts and macroeconomic updates into the timeline every 8 seconds.
- **Infinite Ticker Bar**: A beautifully animated, non-stop scrolling marquee for top-level metrics at the top of the screen.
- **Minimal Premium UI**: Built with Tailwind CSS V4, emphasizing extreme minimalism, deep dark backgrounds, and subtle 1px borders.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS V4
- **Mapping**: `react-simple-maps` + `d3-geo`
- **Icons**: Lucide React & Google Material Symbols
- **Fonts**: Inter & JetBrains Mono

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nexus-terminal.git
   cd nexus-terminal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(Note: This project uses `--legacy-peer-deps` due to React 19 compatibility with react-simple-maps)*

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

NEXUS Terminal completely drops heavy glassmorphism and neon colors in favor of a **Dark Slate** background and strict, 1px borders. It uses `Inter` for general typography and `JetBrains Mono` for tabular data, aiming for the look and feel of a premium, next-generation Bloomberg Terminal.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/nexus-terminal/issues).

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
