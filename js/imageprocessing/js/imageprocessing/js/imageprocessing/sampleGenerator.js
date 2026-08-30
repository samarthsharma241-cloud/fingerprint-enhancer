export class SampleGenerator {
  static generate(type = 'standard', width = 360, height = 360) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (type === 'ninhydrin') {
      ctx.fillStyle = '#f6f3ee';
      ctx.fillRect(0, 0, width, height);
    } else if (type === 'silver_nitrate') {
      ctx.fillStyle = '#eddcc6';
      ctx.fillRect(0, 0, width, height);
    } else if (type === 'cyanoacrylate') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#dcdedf';
      ctx.fillRect(0, 0, width, height);
    }

    const centerX = width * 0.5, centerY = height * 0.52;
    const ridgeCount = 42;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const dy = (y - centerY) / (height * 0.42);
      for (let x = 0; x < width; x++) {
        const dx = (x - centerX) / (width * 0.38);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1.15) continue;

        const boundaryFade = dist > 0.85 ? Math.max(0, 1.0 - (dist - 0.85) / 0.3) : 1.0;
        const angle = Math.atan2(dy, dx);
        const spiralDist = Math.sqrt(dx * dx * 1.3 + dy * dy * 0.85);
        const spiralPhase = spiralDist * ridgeCount + Math.sin(angle * 3.0 + spiralDist * 4.0) * 1.8;
        const perturb = Math.sin(x * 0.12 + Math.cos(y * 0.15)) * 0.6;

        const rawRidge = Math.sin(spiralPhase + perturb);
        let ridgeIntensity = (rawRidge + 1) * 0.5;
        ridgeIntensity = 0.5 + (ridgeIntensity - 0.5) * boundaryFade;

        const idx = (y * width + x) * 4;
        if (type === 'ninhydrin') {
          const t = (1.0 - ridgeIntensity) * 0.75 * boundaryFade;
          data[idx] = Math.round(246 * (1 - t) + 107 * t);
          data[idx + 1] = Math.round(243 * (1 - t) + 33 * t);
          data[idx + 2] = Math.round(238 * (1 - t) + 168 * t);
        } else if (type === 'cyanoacrylate') {
          const t = (1.0 - ridgeIntensity) * 0.88 * boundaryFade;
          data[idx] = Math.round(18 * (1 - t) + 240 * t);
          data[idx + 1] = Math.round(22 * (1 - t) + 244 * t);
          data[idx + 2] = Math.round(32 * (1 - t) + 255 * t);
        } else {
          const val = Math.round(ridgeIntensity * 190 + 40);
          data[idx] = val; data[idx + 1] = val; data[idx + 2] = val;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }
}
