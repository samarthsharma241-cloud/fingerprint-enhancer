import { Icons } from '../utils/icons.js';
import { EnhancementPipeline } from '../imageprocessing/pipeline.js';
import { FileHandler } from '../utils/fileHandler.js';
import { ClarityScoreCard } from './clarityCard.js';
import { appState } from '../state.js';

export class EnhanceView {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeMode = 'enhanced';
    this.render();
    this.bindEvents();

    appState.on('navigatedTo', (tab) => {
      if (tab === 'enhance') { this.render(); this.bindEvents(); }
    });
    appState.on('imageLoaded', () => { this.render(); this.bindEvents(); });
  }

  render() {
    const hasImage = appState.get('hasImage');
    const params = appState.get('parameters');

    if (!hasImage) {
      this.container.innerHTML = `
        <div class="screen-content">
          <header class="app-header"><h1 class="app-title">Enhance Fingerprint</h1></header>
          <div class="m3-card" style="text-align: center; padding: 40px 20px;">
            <p style="margin-bottom: 16px;">Please upload an image first.</p>
            <button class="m3-btn m3-btn-primary" id="goto-upload-btn">${Icons.upload} Go to Upload</button>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="screen-content">
        <header class="app-header">
          <div class="header-top-row">
            <h1 class="app-title">Fingerprint Enhancement</h1>
            <button class="m3-btn-icon m3-btn-tonal" id="btn-download">${Icons.download}</button>
          </div>
          <p class="app-subtitle">Illumination normalization, CLAHE contrast & sharpening</p>
        </header>

        <div class="view-mode-bar">
          <span style="font-size: 11px; font-weight: 700;">OUTPUT VIEW</span>
          <div class="view-toggle-group">
            <button class="view-toggle-btn ${this.activeMode === 'enhanced' ? 'active' : ''}" data-mode="enhanced">Enhanced</button>
            <button class="view-toggle-btn ${this.activeMode === 'ridge-map' ? 'active' : ''}" data-mode="ridge-map">Ridge Map</button>
          </div>
        </div>

        <div class="comparison-container">
          <div class="comparison-pane">
            <div class="pane-header"><span class="pane-title">${Icons.fingerprint} Original</span><span class="m3-chip">Raw</span></div>
            <div class="pane-canvas-box" id="orig-box"></div>
          </div>
          <div class="comparison-pane">
            <div class="pane-header"><span class="pane-title" style="color: var(--md-sys-color-primary);">${Icons.auto_fix_high} Processed</span><span class="m3-chip m3-chip-primary">Enhanced</span></div>
            <div class="pane-canvas-box" id="enh-box"></div>
          </div>
        </div>

        <button class="m3-btn m3-btn-tonal" id="btn-preset" style="width: 100%; margin-bottom: 12px;">${Icons.auto_awesome} Recommended Enhancement</button>

        <div class="enhancement-controls-card">
          <div style="display: flex; justify-content: space-between;"><h3 style="font-size: 13px; font-weight: 700;">Controls</h3><button class="m3-btn m3-btn-outlined" id="btn-reset" style="padding: 2px 10px; font-size: 11px;">Reset</button></div>
          <div><div class="control-title-row"><span class="control-label">${Icons.contrast} Local Contrast</span><span class="m3-slider-badge" id="b-contrast">${params.contrast}</span></div><input type="range" class="m3-slider" id="sl-contrast" min="0" max="100" value="${params.contrast}"></div>
          <div><div class="control-title-row"><span class="control-label">${Icons.blur_off} Noise Reduction</span><span class="m3-slider-badge" id="b-noise">${params.noiseReduction}</span></div><input type="range" class="m3-slider" id="sl-noise" min="0" max="100" value="${params.noiseReduction}"></div>
          <div><div class="control-title-row"><span class="control-label">${Icons.sharpen} Ridge Sharpening</span><span class="m3-slider-badge" id="b-sharpen">${params.ridgeSharpening}</span></div><input type="range" class="m3-slider" id="sl-sharpen" min="0" max="100" value="${params.ridgeSharpening}"></div>
        </div>

        <button class="m3-btn m3-btn-primary" id="btn-apply-enhance" style="width: 100%; padding: 14px; margin-bottom: 16px;">${Icons.auto_fix_high} Enhance Fingerprint</button>
        <div id="clarity-card-slot"></div>
      </div>
    `;

    this.mountCanvases();
    const slot = this.container.querySelector('#clarity-card-slot');
    if (slot) new ClarityScoreCard(slot);
  }

  mountCanvases() {
    const oB = this.container.querySelector('#orig-box');
    const eB = this.container.querySelector('#enh-box');
    const orig = appState.get('originalCanvas');
    const enh = appState.get('enhancedCanvas');
    const ridge = appState.get('ridgeMapCanvas');

    if (oB && orig) { oB.innerHTML = ''; oB.appendChild(orig); }
    if (eB) {
      eB.innerHTML = '';
      const active = (this.activeMode === 'ridge-map' && ridge) ? ridge : enh;
      if (active) eB.appendChild(active);
    }
  }

  bindEvents() {
    this.container.querySelector('#goto-upload-btn')?.addEventListener('click', () => appState.navigateTo('upload'));

    this.container.querySelector('#sl-contrast')?.addEventListener('input', (e) => {
      appState.setParameter('contrast', e.target.value);
      this.container.querySelector('#b-contrast').textContent = e.target.value;
    });
    this.container.querySelector('#sl-noise')?.addEventListener('input', (e) => {
      appState.setParameter('noiseReduction', e.target.value);
      this.container.querySelector('#b-noise').textContent = e.target.value;
    });
    this.container.querySelector('#sl-sharpen')?.addEventListener('input', (e) => {
      appState.setParameter('ridgeSharpening', e.target.value);
      this.container.querySelector('#b-sharpen').textContent = e.target.value;
    });

    this.container.querySelector('#btn-apply-enhance')?.addEventListener('click', () => this.runEnhance());
    this.container.querySelector('#btn-preset')?.addEventListener('click', () => {
      appState.setRecommendedParameters();
      this.render(); this.bindEvents();
      this.runEnhance();
    });
    this.container.querySelector('#btn-reset')?.addEventListener('click', () => {
      appState.resetParameters();
      this.render(); this.bindEvents();
    });

    this.container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeMode = btn.dataset.mode;
        this.render(); this.bindEvents();
      });
    });

    this.container.querySelector('#btn-download')?.addEventListener('click', () => {
      const active = (this.activeMode === 'ridge-map' && appState.get('ridgeMapCanvas')) ? appState.get('ridgeMapCanvas') : appState.get('enhancedCanvas');
      if (active) FileHandler.downloadCanvas(active);
    });
  }

  async runEnhance() {
    const orig = appState.get('originalCanvas');
    if (!orig) return;

    const overlay = document.querySelector('.processing-overlay');
    if (overlay) overlay.classList.add('active');

    try {
      const params = appState.get('parameters');
      const res = await EnhancementPipeline.process(orig, params);
      appState.setEnhancedResult(res.enhancedCanvas, res.clarityScore, res.ridgeMapCanvas);
      this.mountCanvases();
      const slot = this.container.querySelector('#clarity-card-slot');
      if (slot) new ClarityScoreCard(slot);
    } catch (e) {
      alert('Processing error: ' + e.message);
    } finally {
      if (overlay) overlay.classList.remove('active');
    }
  }
}
