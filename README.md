# Quick Convert V2 by Plzwork — The Fastest Universal Conversion Engine

**Quick Convert V2** is the flagship universal conversion platform by **Plzwork**. It combines modular plugin-driven engineering, a decoupled conversion graph engine, natural language expressions, a Raycast-style Command Palette (`⌘K`), local history & pinned shortcuts, developer utilities, and client-side image processing.

---

## 🌟 Key Features

- **⚡ Universal Plugin Engine**: Modular, extensible architecture supporting **Length**, **Weight/Mass**, **Temperature**, **Currency**, **Digital Storage**, **Volume**, **Area**, **Speed**, **Time**, **Pressure**, **Energy**, **Angle**, **Developer Utilities**, and **Image Processing**.
- **💬 Natural Language Parsing**: Instantly converts queries like `"5 feet to cm"`, `"100 usd to eur"`, `"100°C"`, or `"15 miles"`.
- **⌨️ Keyboard-First Command Palette (`⌘K` / `/`)**: Jump to any category, unit, or conversion instantly without leaving the keyboard.
- **📜 Local History & Pinned Shortcuts**: Automatically preserves calculations locally with pin/favorite shortcuts and deduplication.
- **📋 Smart Clipboard Intelligence**: Non-intrusive banner detects unit values in the clipboard and offers one-click conversion.
- **🛠️ Developer Utilities**: Integrated Base64 encoder/decoder, UUID v4 generator, and JSON Formatter/Validator.
- **🖼️ Client-Side Image Converter**: Convert WebP, JPEG, PNG, HEIC, and HEIF files with multi-threading Web Workers.
- **📱 Installable PWA & Offline Support**: Full PWA capabilities for offline desktop & mobile usage.

---

## 🏗️ Architecture & Plugin System

Quick Convert V2 separates unit math and logic strictly from UI components:

```
src/
├── engine/                # Core Conversion Graph Engine
│   ├── types.ts           # Type definitions for Units, Plugins, Results
│   ├── registry.ts        # Dynamic Plugin Registry
│   ├── conversionGraph.ts # Ratio & non-linear formula math engine
│   ├── parser.ts          # Natural Language Parser
│   ├── search.ts          # Smart search & alias index
│   └── history.ts         # LocalStorage history & event emitters
├── plugins/               # Extensible Converter Plugins
│   ├── length.ts
│   ├── weight.ts
│   ├── temperature.ts
│   ├── currency.ts
│   ├── digital.ts
│   ├── volume.ts
│   ├── area.ts
│   ├── speed.ts
│   ├── time.ts
│   ├── pressure.ts
│   ├── energy.ts
│   ├── angle.ts
│   └── dev-utilities.ts
└── app/components/        # UI Layer (UniversalConverter, CommandPalette, etc.)
```

### Adding a New Converter Plugin

Adding a new unit or dimension requires dropping a single plugin file into `src/plugins/`:

```typescript
import { ConverterPlugin } from "../engine/types";

export const myPlugin: ConverterPlugin = {
  id: "custom",
  name: "Custom Dimension",
  description: "Convert custom units",
  iconName: "Zap",
  baseUnitId: "base_unit",
  units: [ /* Unit definitions */ ]
};
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm / pnpm / yarn

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sajidhossain8272/plzwork.git
   cd plzwork
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Vitest test suite**:
   ```bash
   npm test
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment & Domains

The app routes by hostname at the edge (see [`src/middleware.ts`](src/middleware.ts)):

| Host | Serves |
| --- | --- |
| `quickconvert.plzwork.app` | Quick Convert app (this app) |
| `plzwork.app` / `www.plzwork.app` | Blank white **Coming Soon** placeholder |
| `quick-convert-img.vercel.app` (legacy) | 308 redirect → `quickconvert.plzwork.app` |

Any other host (e.g. Vercel preview deployments) serves the Quick Convert app.

---

## 📄 License

Licensed under the MIT License. Built with ❤️ by **Plzwork**.
