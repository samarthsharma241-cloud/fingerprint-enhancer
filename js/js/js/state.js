export class AppState {
  constructor() {
    this.listeners = new Map();
    this.state = {
      activeTab: 'home',
      theme: 'light',
      hasImage: false,
      originalCanvas: null,
      enhancedCanvas: null,
      ridgeMapCanvas: null,
      imageMetadata: {
        name: '', size: '', originalDimensions: '', processingDimensions: '',
        isDemo: false, isCropped: false, qualityLevel: 'Good',
        qualityMessage: 'Fingertip region has sufficient visible ridge detail.'
      },
      parameters: { contrast: 65, noiseReduction: 35, ridgeSharpening: 60 },
      clarityScore: { rawScore: 0, enhancedScore: 0, delta: '+0', metrics: { contrast: 0, separation: 0, sharpness: 0, snr: 0 }, hasCalculated: false }
    };
  }

  get(key) { return this.state[key]; }

  set(key, value) {
    this.state[key] = value;
    this.emit(key, value);
  }

  navigateTo(tabId) {
    this.state.activeTab = tabId;
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${tabId}`);
    if (target) {
      target.classList.add('active');
      const container = document.querySelector('.app-screen-container');
      if (container) container.scrollTop = 0;
    }
    this.emit('activeTab', tabId);
    this.emit('navigatedTo', tabId);
  }

  setImage(canvas, metadata = {}) {
    this.state.hasImage = true;
    this.state.originalCanvas = canvas;
    const initialCopy = document.createElement('canvas');
    initialCopy.width = canvas.width; initialCopy.height = canvas.height;
    initialCopy.getContext('2d').drawImage(canvas, 0, 0);
    this.state.enhancedCanvas = initialCopy;
    this.state.ridgeMapCanvas = null;

    this.state.imageMetadata = {
      name: metadata.name || 'Fingerprint.jpg',
      size: metadata.size || '1.2 MB',
      originalDimensions: metadata.originalDimensions || `${canvas.width} × ${canvas.height} px`,
      processingDimensions: `${canvas.width} × ${canvas.height} px`,
      isDemo: Boolean(metadata.isDemo),
      isCropped: Boolean(metadata.isCropped),
      qualityLevel: 'Good',
      qualityMessage: 'Fingertip region has sufficient visible ridge detail.'
    };
    this.emit('imageLoaded', { canvas, metadata: this.state.imageMetadata });
  }

  setEnhancedResult(canvas, clarityScore, ridgeMapCanvas = null) {
    this.state.enhancedCanvas = canvas;
    this.state.clarityScore = clarityScore;
    if (ridgeMapCanvas) this.state.ridgeMapCanvas = ridgeMapCanvas;
    this.emit('enhancementCompleted', { canvas, clarityScore });
  }

  setParameter(k, v) {
    this.state.parameters[k] = Number(v);
  }

  setRecommendedParameters() {
    this.state.parameters = { contrast: 65, noiseReduction: 35, ridgeSharpening: 60 };
  }

  resetParameters() {
    this.state.parameters = { contrast: 50, noiseReduction: 30, ridgeSharpening: 50 };
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error(e); }
      });
    }
  }
}

export const appState = new AppState();
