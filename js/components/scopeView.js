import { Icons } from '../utils/icons.js';

export class ScopeView {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="screen-content">
        <header class="app-header">
          <h1 class="app-title">Future Scope & AI</h1>
          <p class="app-subtitle">Future biometric & deep learning roadmap</p>
        </header>

        <div class="m3-card">
          <h3 class="section-card-title">${Icons.psychology} Neural Ridge Reconstruction</h3>
          <p style="font-size: 12px; line-height: 1.5; color: var(--md-sys-color-on-surface-variant); margin-bottom: 12px;">
            Future integration with deep convolutional neural networks (CNNs) and Generative Adversarial Networks (GANs) to interpolate missing ridge flows across damaged latent prints.
          </p>
          <span class="m3-chip m3-chip-primary">Phase 2 Roadmap</span>
        </div>

        <div class="m3-card">
          <h3 class="section-card-title">${Icons.auto_awesome} Automated Minutiae Extraction</h3>
          <p style="font-size: 12px; line-height: 1.5; color: var(--md-sys-color-on-surface-variant); margin-bottom: 12px;">
            AI-driven detection and classification of Level 2 (bifurcations, endings, dots) and Level 3 (sweat pores, incipient ridges) biometric features.
          </p>
          <span class="m3-chip m3-chip-accent">Phase 3 Roadmap</span>
        </div>

        <div class="m3-card">
          <h3 class="section-card-title">${Icons.fingerprint} AFIS Interoperability</h3>
          <p style="font-size: 12px; line-height: 1.5; color: var(--md-sys-color-on-surface-variant); margin-bottom: 12px;">
            Exporting standardized ANSI/NIST-ITL feature templates for automated fingerprint search systems.
          </p>
          <span class="m3-chip">Phase 4 Roadmap</span>
        </div>
      </div>
    `;
  }
}
