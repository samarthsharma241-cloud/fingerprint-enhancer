# Fingerprint Enhancer 🔬🔍

**AI-Assisted Digital Enhancement for Chemically Developed Latent Friction Ridge Impressions**

*Fingerprint Enhancer* is a forensic-oriented web application featuring a modern Material Design 3 mobile interface. It simulates digital latent fingerprint enhancement workflows commonly used in forensic identification and friction ridge analysis.

---

## ✨ Features

- **Spatial Digital Processing Pipeline**:
  - **Illumination Normalization**: Background subtraction and uneven lighting correction.
  - **Adaptive Contrast (CLAHE)**: Local ridge amplification without over-saturating background noise.
  - **Noise Reduction**: Directional smoothing to suppress surface grain and chemical artifacting.
  - **Ridge Sharpening**: High-pass Laplacian and Sobel gradient sharpening for enhanced ridge-valley separation.
  - **Binary Ridge Map Extraction**: Visualizes ridge flow skeletons and core biometric features.

- **Objective Clarity Score (0–100)**:
  - Quantitative metrics calculating ridge sharpness, valley separation, local contrast, and signal-to-noise ratio (SNR).
  - Pre- and post-enhancement comparison metrics with real-time improvement delta.

- **Chemical Reagent Simulations**:
  - **Ninhydrin**: Simulates reaction with amino acids producing Ruhemann's Purple on porous paper/cardboard.
  - **Cyanoacrylate (Superglue Fuming)**: Simulates 3D polycyanoacrylate ridge growth on non-porous glass/metal.
  - **Silver Nitrate**: Simulates photoreactive dark silver chloride impressions on aged wood and paper.
  - **Latent Noisy Sample**: Simulates faint, noisy latent friction ridges.

- **Interactive Tools & Forensics UI**:
  - **Interactive Cropping & Orientation**: Rotate 90° clockwise/counter-clockwise, auto-detection, and bounding box selection.
  - **Dual-Pane Comparison**: Real-time side-by-side comparison of original raw impression vs. processed ridges.
  - **Exporting**: Export high-resolution enhanced fingerprint impressions as PNG.
  - **Material 3 Interface**: Smooth transitions, Android status bar simulation, phone frame toggle, and light/dark theme support.

---

## 📁 Repository Structure

```
.
├── index.html                  # Main modular HTML5 entry point
├── standalone.html             # Self-contained single-file version (file:// compatible)
├── manifest.json               # Progressive Web App manifest
├── README.md                   # Project documentation
│
├── css/                        # Stylesheets
│   ├── app.css                 # Application views, cards, sliders, and overlays
│   ├── material3.css           # Material Design 3 design tokens & theme palettes
│   └── mobile-frame.css        # Android phone mockup frame and responsive stage
│
└── js/                         # ES6 Modular JavaScript
    ├── app.js                  # Main application initializer
    ├── state.js                # Reactive centralized state management
    │
    ├── components/             # UI Components & View Controllers
    │   ├── clarityCard.js      # Circular clarity meter & metric breakdown
    │   ├── cropper.js          # Interactive canvas crop modal
    │   ├── enhanceView.js      # Enhancement sliders, comparison panes & controls
    │   ├── homeView.js         # Welcome hero, quick actions & workflow summary
    │   ├── navigation.js       # Persistent M3 bottom navigation bar
    │   ├── reagentsView.js     # Chemical reagent catalog & interactive samples
    │   ├── scopeView.js        # AI / AFIS future development roadmap
    │   └── uploadView.js       # File drag-and-drop & preset sample selector
    │
    ├── imageprocessing/        # Forensic Image Processing Algorithms
    │   ├── clarityCalculator.js# Quantitative clarity metric calculation
    │   ├── contrastProcessor.js# Grayscale conversion & illumination normalization
    │   ├── noiseReducer.js     # Spatial noise filtering
    │   ├── pipeline.js         # Multi-pass enhancement pipeline coordinator
    │   ├── ridgeSharpener.js   # High-pass ridge filter & edge boost
    │   └── sampleGenerator.js  # Procedural synthetic latent fingerprint generator
    │
    └── utils/                  # Utilities
        ├── fileHandler.js      # Image downscaling, loading, and PNG export
        └── icons.js            # Scalable vector graphics (SVG) icons
```

---

## 🚀 Getting Started

### Option 1: Run with a Local Web Server (Recommended for Modular Code)
Because `index.html` loads modular JavaScript (`type="module"`), it should be served over HTTP:

**Python**:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/`.

**Node.js**:
```bash
npx serve .
```

**VS Code**:
Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Standalone Offline Mode (Zero Setup)
Double-click [`standalone.html`](./standalone.html) directly in Windows Explorer to open it in any web browser without needing a local web server.

---

## 🔬 How the Enhancement Pipeline Works

1. **Grayscale Conversion**: Luminance mapping using the standard perceptual formula ($0.299R + 0.587G + 0.114B$).
2. **Illumination Normalization**: Estimates localized background illumination using a sliding box filter and subtracts low-frequency lighting gradients.
3. **Contrast Amplification**: Applies adaptive histogram stretching to separate ridges from background noise without clipping delicate ridge endings.
4. **Noise Reduction**: Attenuates salt-and-pepper grain and surface textures.
5. **Spatial High-Pass Sharpening**: Applies a discrete Laplacian convolution kernel $\begin{bmatrix}0 & -1 & 0\\ -1 & 5 & -1\\ 0 & -1 & 0\end{bmatrix}$ scaled by the user's sharpening preference.
6. **Clarity Assessment**: Computes the ratio of high-frequency ridge boundaries against background variance to compute an objective Clarity Score.

---

## ⚖️ Forensic Disclaimer

*This application is designed solely for educational, academic, and prototyping purposes. Digital enhancements provided by this tool are for visual demonstration and do not guarantee automated biometric identification or replace accredited forensic friction ridge analysis (ACE-V methodology).*
