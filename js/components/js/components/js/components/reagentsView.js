import { Icons } from '../utils/icons.js';
import { SampleGenerator } from '../imageprocessing/sampleGenerator.js';
import { appState } from '../state.js';

export class ReagentsView {
  constructor(containerEl) {
    this.container = containerEl;
    this.reagents = [
      { id: 'ninhydrin', title: 'Ninhydrin', surface: 'Porous (Paper/Cardboard)', desc: 'Reacts with terminal amino acids producing Ruhemann\'s Purple.' },
      { id: 'cyanoacrylate', title: 'Cyanoacrylate (Superglue)', surface: 'Non-Porous (Glass/Metal)', desc: 'Fumes polymerize along latent ridge moisture forming white 3D deposits.' },
      { id: 'silver_nitrate', title: 'Silver Nitrate', surface: 'Porous (Aged Wood/Paper)', desc: 'Reacts with chloride ions forming photoreactive silver chloride.' }
    ];
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="screen-content">
        <header class="app-header">
          <h1 class="app-title">Chemical Reagents</h1>
          <p class="app-subtitle">Forensic latent print development methods</p>
        </header>

        <div class="reagents-grid">
          ${this.reagents.map(r => `
            <div class="reagent-card" data-id="${r.id}">
              <div class="reagent-preview-box" id="r-thumb-${r.id}"></div>
              <div class="reagent-info">
                <h3 class="reagent-title">${r.title}</h3>
                <span class="m3-chip m3-chip-primary" style="margin-bottom: 4px;">${r.surface}</span>
                <p class="reagent-desc">${r.desc}</p>
                <button class="m3-btn m3-btn-tonal" style="padding: 4px 12px; font-size: 11px;">Enhance This Sample</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.reagents.forEach(r => {
      const box = this.container.querySelector(`#r-thumb-${r.id}`);
      if (box) box.appendChild(SampleGenerator.generate(r.id, 80, 80));
    });
  }

  bindEvents() {
    this.container.querySelectorAll('.reagent-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const fullCanvas = SampleGenerator.generate(id, 400, 400);
        appState.setImage(fullCanvas, { name: `${id}_sample.png`, isDemo: true });
        appState.navigateTo('enhance');
      });
    });
  }
}
