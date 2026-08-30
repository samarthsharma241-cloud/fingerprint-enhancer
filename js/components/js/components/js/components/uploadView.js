import { Icons } from '../utils/icons.js';
import { FileHandler } from '../utils/fileHandler.js';
import { SampleGenerator } from '../imageprocessing/sampleGenerator.js';
import { FingerprintCropper } from './cropper.js';
import { appState } from '../state.js';

export class UploadView {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
    this.bindEvents();

    appState.on('imageLoaded', () => {
      this.render();
      this.bindEvents();
    });
  }

  render() {
    const hasImage = appState.get('hasImage');
    const meta = appState.get('imageMetadata');

    this.container.innerHTML = `
      <div class="screen-content">
        <header class="app-header">
          <h1 class="app-title">Upload Fingerprint</h1>
          <p class="app-subtitle">Select photo or explore forensic developer samples</p>
        </header>

        ${!hasImage ? `
          <div class="upload-dropzone" id="upload-dropzone">
            <input type="file" id="file-input-hidden" accept="image/png, image/jpeg, image/jpg" style="display: none;">
            <div class="dropzone-icon-wrap">${Icons.upload}</div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Choose Image</h3>
            <p style="font-size: 12px; color: var(--md-sys-color-on-surface-variant); margin-bottom: 16px;">Supports smartphone photos, JPEG, and PNG</p>
            <button class="m3-btn m3-btn-primary" id="btn-browse-file">Browse Device</button>
          </div>

          <div style="margin-top: 24px;">
            <h3 class="section-card-title">${Icons.science} Or Select Chemical Sample</h3>
            <div class="demo-samples-grid">
              <div class="demo-sample-btn" data-demo="ninhydrin">
                <div class="demo-thumb-box" id="thumb-ninhydrin"></div>
                <span style="font-size: 11px; font-weight: 700;">Ninhydrin</span>
              </div>
              <div class="demo-sample-btn" data-demo="cyanoacrylate">
                <div class="demo-thumb-box" id="thumb-cyano"></div>
                <span style="font-size: 11px; font-weight: 700;">Superglue</span>
              </div>
              <div class="demo-sample-btn" data-demo="latent_noisy">
                <div class="demo-thumb-box" id="thumb-latent"></div>
                <span style="font-size: 11px; font-weight: 700;">Latent</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="m3-card">
            <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">Selected Image</h3>
            <div class="pane-canvas-box" id="upload-preview-box"></div>
            <div class="image-meta-box">
              <div class="meta-row"><span>Original:</span><strong>${meta.originalDimensions}</strong></div>
              <div class="meta-row"><span>Processing:</span><strong style="color: var(--md-sys-color-primary);">${meta.processingDimensions}</strong></div>
              <div class="meta-row"><span>Quality:</span><span class="m3-chip m3-chip-primary">${meta.qualityLevel}</span></div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; gap: 10px;">
              <button class="m3-btn m3-btn-tonal" id="crop-image-btn" style="flex: 1;">Crop Fingerprint</button>
              <button class="m3-btn m3-btn-outlined" id="replace-image-btn" style="flex: 1;">Replace Image</button>
            </div>
            <button class="m3-btn m3-btn-primary" id="continue-to-enhance-btn" style="padding: 14px;">Continue to Enhance</button>
          </div>
        `}
      </div>
    `;

    this.mountThumbs();
  }

  mountThumbs() {
    const origCanvas = appState.get('originalCanvas');
    const previewBox = this.container.querySelector('#upload-preview-box');
    if (previewBox && origCanvas) {
      previewBox.innerHTML = '';
      previewBox.appendChild(origCanvas);
    }

    const tN = this.container.querySelector('#thumb-ninhydrin');
    if (tN) tN.appendChild(SampleGenerator.generate('ninhydrin', 100, 100));

    const tC = this.container.querySelector('#thumb-cyano');
    if (tC) tC.appendChild(SampleGenerator.generate('cyanoacrylate', 100, 100));

    const tL = this.container.querySelector('#thumb-latent');
    if (tL) tL.appendChild(SampleGenerator.generate('latent_noisy', 100, 100));
  }

  bindEvents() {
    const fileInput = this.container.querySelector('#file-input-hidden');
    this.container.querySelector('#btn-browse-file')?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const { canvas, metadata } = await FileHandler.loadAndScaleImage(file);
        appState.setImage(canvas, metadata);
      }
    });

    this.container.querySelectorAll('.demo-sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.demo;
        const canvas = SampleGenerator.generate(type, 400, 400);
        appState.setImage(canvas, { name: `${type}_sample.png`, size: '180 KB', isDemo: true });
      });
    });

    this.container.querySelector('#crop-image-btn')?.addEventListener('click', () => {
      const orig = appState.get('originalCanvas');
      if (orig) {
        new FingerprintCropper(orig, (cropped) => {
          appState.setImage(cropped, { name: 'cropped_fingerprint.png', isCropped: true });
        });
      }
    });

    this.container.querySelector('#replace-image-btn')?.addEventListener('click', () => {
      appState.set('hasImage', false);
      this.render();
      this.bindEvents();
    });

    this.container.querySelector('#continue-to-enhance-btn')?.addEventListener('click', () => {
      appState.navigateTo('enhance');
    });
  }
}
