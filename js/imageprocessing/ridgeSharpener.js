export class RidgeSharpener {
  static apply(grayBuffer, width, height, intensity = 60) {
    if (intensity <= 0) return new Float32Array(grayBuffer);

    const len = width * height;
    const output = new Float32Array(len);
    const alpha = (intensity / 50.0) * 0.75;

    for (let y = 0; y < height; y++) {
      const yOffset = y * width;
      const yPrevOffset = Math.max(0, y - 1) * width;
      const yNextOffset = Math.min(height - 1, y + 1) * width;

      for (let x = 0; x < width; x++) {
        const xPrev = Math.max(0, x - 1);
        const xNext = Math.min(width - 1, x + 1);

        const centerIdx = yOffset + x;
        const centerVal = grayBuffer[centerIdx];

        const top = grayBuffer[yPrevOffset + x];
        const bottom = grayBuffer[yNextOffset + x];
        const left = grayBuffer[yOffset + xPrev];
        const right = grayBuffer[yOffset + xNext];

        const laplacian = 4 * centerVal - (top + bottom + left + right);
        const sharpVal = centerVal + alpha * laplacian;
        output[centerIdx] = Math.max(0, Math.min(255, sharpVal));
      }
    }
    return output;
  }

  static generateRidgeMap(grayBuffer, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const localMean = new Float32Array(width * height);
    const r = 5;
    const temp = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      const yOff = y * width;
      let sum = 0, count = 0;
      for (let dx = -r; dx <= r; dx++) {
        const nx = Math.min(width - 1, Math.max(0, dx));
        sum += grayBuffer[yOff + nx];
        count++;
      }
      temp[yOff] = sum / count;

      for (let x = 1; x < width; x++) {
        const rem = Math.max(0, x - r - 1);
        const add = Math.min(width - 1, x + r);
        sum += grayBuffer[yOff + add] - grayBuffer[yOff + rem];
        temp[yOff + x] = sum / count;
      }
    }

    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0;
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(height - 1, Math.max(0, dy));
        sum += temp[ny * width + x];
        count++;
      }
      localMean[x] = sum / count;

      for (let y = 1; y < height; y++) {
        const rem = Math.max(0, y - r - 1);
        const add = Math.min(height - 1, y + r);
        sum += temp[add * width + x] - temp[rem * width + x];
        localMean[y * width + x] = sum / count;
      }
    }

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const isRidge = grayBuffer[j] < (localMean[j] - 2.5);
      if (isRidge) {
        data[i] = 34; data[i + 1] = 211; data[i + 2] = 238; data[i + 3] = 255;
      } else {
        data[i] = 11; data[i + 1] = 15; data[i + 2] = 25; data[i + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }
}
