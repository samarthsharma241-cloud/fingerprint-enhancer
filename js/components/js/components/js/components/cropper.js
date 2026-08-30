export class FingerprintCropper {
  constructor(sourceCanvas, onConfirm, onCancel) {
    this.sourceCanvas = sourceCanvas;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.rotation = 0;

    const minDim = Math.min(sourceCanvas.width, sourceCanvas.height);
    this.crop = {
      x: (sourceCanvas.width - minDim * 0.75) / 2,
      y: (sourceCanvas.height - minDim * 0.75) / 2,
      w: minDim * 0.75,
      h: minDim * 0.75
    };
    this.isDragging = false;
    this.mount();
  }

  mount() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop active';
    this.modalEl.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-header">
          <h2 class="modal-title">Crop Fingerprint Region</h2>
          <button class="modal-close-btn" id="crop-cancel-btn">&times;</button>
        </div>
        <div class="cropper-toolbar">
          <button class="m3-btn m3-btn-tonal cropper-tool-btn" id="crop-auto-btn">Auto Detect</button>
          <div style="display: flex; gap: 4px;">
            <button class="m3-btn m3-btn-outlined cropper-tool-btn" id="crop-rot-l">↺ 90°</button>
            <button class="m3-btn m3-btn-outlined cropper-tool-btn" id="crop-rot-r">↻ 90°</button>
          </div>
        </div>
        <div class="cropper-canvas-container" id="crop-box">
          <canvas id="crop-canvas"></canvas>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 14px;">
          <button class="m3-btn m3-btn-outlined" id="crop-cancel-btn-2" style="flex: 1;">Cancel</button>
          <button class="m3-btn m3-btn-primary" id="crop-confirm-btn" style="flex: 1;">Confirm Crop</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.modalEl);

    this.canvas = this.modalEl.querySelector('#crop-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container = this.modalEl.querySelector('#crop-box');

    this.canvas.width = this.container.clientWidth || 340;
    this.canvas.height = this.container.clientHeight || 320;

    this.bindEvents();
    this.draw();
  }

  draw() {
    const vw = this.canvas.width, vh = this.canvas.height;
    this.ctx.clearRect(0, 0, vw, vh);

    const scale = Math.min((vw - 32) / this.sourceCanvas.width, (vh - 32) / this.sourceCanvas.height);
    const offsetX = (vw - this.sourceCanvas.width * scale) / 2;
    const offsetY = (vh - this.sourceCanvas.height * scale) / 2;

    this.ctx.save();
    this.ctx.translate(vw / 2, vh / 2);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    this.ctx.drawImage(this.sourceCanvas, -this.sourceCanvas.width * scale / 2, -this.sourceCanvas.height * scale / 2, this.sourceCanvas.width * scale, this.sourceCanvas.height * scale);
    this.ctx.restore();

    const cx = offsetX + this.crop.x * scale;
    const cy = offsetY + this.crop.y * scale;
    const cw = this.crop.w * scale;
    const ch = this.crop.h * scale;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, vw, vh);
    this.ctx.clearRect(cx, cy, cw, ch);

    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(cx, cy, cw, ch);
  }

  bindEvents() {
    this.modalEl.querySelector('#crop-cancel-btn')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#crop-cancel-btn-2')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#crop-rot-l')?.addEventListener('click', () => { this.rotation = (this.rotation - 90 + 360) % 360; this.draw(); });
    this.modalEl.querySelector('#crop-rot-r')?.addEventListener('click', () => { this.rotation = (this.rotation + 90) % 360; this.draw(); });
    this.modalEl.querySelector('#crop-auto-btn')?.addEventListener('click', () => {
      const minDim = Math.min(this.sourceCanvas.width, this.sourceCanvas.height);
      this.crop = { x: (this.sourceCanvas.width - minDim * 0.65) / 2, y: (this.sourceCanvas.height - minDim * 0.65) / 2, w: minDim * 0.65, h: minDim * 0.65 };
      this.draw();
    });

    this.modalEl.querySelector('#crop-confirm-btn')?.addEventListener('click', () => {
      const out = document.createElement('canvas');
      out.width = Math.round(this.crop.w);
      out.height = Math.round(this.crop.h);
      out.getContext('2d').drawImage(this.sourceCanvas, this.crop.x, this.crop.y, this.crop.w, this.crop.h, 0, 0, this.crop.w, this.crop.h);
      this.close();
      if (this.onConfirm) this.onConfirm(out);
    });
  }

  close() {
    this.modalEl?.remove();
  }
}
