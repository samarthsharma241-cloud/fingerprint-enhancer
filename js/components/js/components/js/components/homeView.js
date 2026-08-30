import { Icons } from '../utils/icons.js';
import { appState } from '../state.js';

export class HomeView {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="screen-content">
        <header class="app-header">
          <div class="header-top-row">
            <span class="brand-badge">${Icons.fingerprint} FORENSIC DIGITAL SUITE</span>
            <button class="theme-toggle-btn" id="home-theme-toggle">${Icons.dark_mode}</button>
          </div>
          <h1 class="app-title">Fingerprint Enhancer</h1>
          <p class="app-subtitle">AI-Assisted Fingerprint Image Enhancement</p>
          <div class="forensic-disclaimer">
            ${Icons.info}
            <span>Educational demonstration only. Enhancement does not guarantee accurate fingerprint identification.</span>
          </div>
        </header>

        <div class="hero-fingerprint-card">
          <div class="hero-chip">${Icons.auto_awesome} PROTOTYPE v1.0</div>
          <h2 class="hero-title">Digital Ridge Optimization</h2>
          <p class="hero-desc">Transform latent and chemically developed friction ridge impressions through high-precision spatial filters.</p>
          <button class="m3-btn m3-btn-primary" id="hero-quick-start-btn">${Icons.upload} Start Enhancing</button>
          <div class="hero-watermark-icon">${Icons.fingerprint}</div>
        </div>

        <div class="home-cards-grid">
          <div class="nav-feature-card" id="home-card-upload">
            <div class="nav-card-icon icon-blue">${Icons.upload}</div>
            <div class="nav-card-content"><h3 class="nav-card-title">Upload Fingerprint</h3><p class="nav-card-desc">Import photo or select chemical development sample.</p></div>
            <div class="nav-card-arrow">${Icons.arrow_forward}</div>
          </div>
          <div class="nav-feature-card" id="home-card-reagents">
            <div class="nav-card-icon icon-purple">${Icons.science}</div>
            <div class="nav-card-content"><h3 class="nav-card-title">Chemical Reagents</h3><p class="nav-card-desc">Simulate Ninhydrin, Silver Nitrate, and Superglue.</p></div>
            <div class="nav-card-arrow">${Icons.arrow_forward}</div>
          </div>
          <div class="nav-feature-card" id="home-card-scope">
            <div class="nav-card-icon icon-teal">${Icons.psychology}</div>
            <div class="nav-card-content"><h3 class="nav-card-title">Future Scope</h3><p class="nav-card-desc">Explore AI ridge reconstruction & AFIS matching.</p></div>
            <div class="nav-card-arrow">${Icons.arrow_forward}</div>
          </div>
        </div>

        <div class="how-it-works-card">
          <h3 class="section-card-title">${Icons.auto_fix_high} How it works</h3>
          <div class="steps-list">
            <div class="step-item"><div class="step-number">1</div><span class="step-text">Upload photo or choose demo reagent sample</span></div>
            <div class="step-item"><div class="step-number">2</div><span class="step-text">Apply multi-stage spatial digital enhancement</span></div>
            <div class="step-item"><div class="step-number">3</div><span class="step-text">Compare original and enhanced ridges</span></div>
            <div class="step-item"><div class="step-number">4</div><span class="step-text">Evaluate mathematical clarity score</span></div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#hero-quick-start-btn')?.addEventListener('click', () => appState.navigateTo('upload'));
    this.container.querySelector('#home-card-upload')?.addEventListener('click', () => appState.navigateTo('upload'));
    this.container.querySelector('#home-card-reagents')?.addEventListener('click', () => appState.navigateTo('reagents'));
    this.container.querySelector('#home-card-scope')?.addEventListener('click', () => appState.navigateTo('scope'));
    this.container.querySelector('#home-theme-toggle')?.addEventListener('click', () => {
      const cur = appState.get('theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      appState.set('theme', next);
      document.documentElement.setAttribute('data-theme', next);
    });
  }
}
