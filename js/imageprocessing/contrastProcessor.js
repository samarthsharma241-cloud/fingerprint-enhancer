export class ContrastProcessor {
  static toGrayscale(imageData) {
    const { data, width, height } = imageData;
    const len = width * height;
    const gray = new Float32Array(len);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = 0.15 * data[i] + 0.60 * data[i + 1] + 0.25 * data[i + 2];
    }
    return gray;
  }

  static normalizeIllumination(gray, width, height, radius = 18) {
    const len = width * height;
    const bg = new Float32Array(len);
    const output = new Float32Array(len);
    const temp = new Float32Array(len);

    for (let y = 0; y < height; y++) {
      const yOffset = y * width;
      let windowSum = 0, count = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = Math.min(width - 1, Math.max(0, dx));
        windowSum += gray[yOffset + nx];
        count++;
      }
      temp[yOffset] = windowSum / count;

      for (let x = 1; x < width; x++) {
        const removeX = Math.max(0, x - radius - 1);
        const addX = Math.min(width - 1, x + radius);
        windowSum += gray[yOffset + addX] - gray[yOffset + removeX];
        temp[yOffset + x] = windowSum / count;
      }
    }

    for (let x = 0; x < width; x++) {
      let windowSum = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = Math.min(height - 1, Math.max(0, dy));
        windowSum += temp[ny * width + x];
        count++;
      }
      bg[x] = windowSum / count;

      for (let y = 1; y < height; y++) {
        const removeY = Math.max(0, y - radius - 1);
        const addY = Math.min(height - 1, y + radius);
        windowSum += temp[addY * width + x] - temp[removeY * width + x];
        bg[y * width + x] = windowSum / count;
      }
    }

    for (let i = 0; i < len; i++) {
      const normalized = (gray[i] - bg[i]) * 1.35 + 128;
      output[i] = Math.max(0, Math.min(255, normalized));
    }
    return output;
  }

  static applyCLAHE(gray, width, height, intensity = 65) {
    const len = width * height;
    if (intensity <= 0) return new Float32Array(gray);

    const numTilesX = 8, numTilesY = 8;
    const tileW = width / numTilesX, tileH = height / numTilesY;
    const clipFactor = 1.8 + (intensity / 100.0) * 2.8;
    const cdfs = [];

    for (let ty = 0; ty < numTilesY; ty++) {
      cdfs[ty] = [];
      const startY = Math.floor(ty * tileH);
      const endY = Math.floor((ty + 1) * tileH);

      for (let tx = 0; tx < numTilesX; tx++) {
        const startX = Math.floor(tx * tileW);
        const endX = Math.floor((tx + 1) * tileW);
        const hist = new Int32Array(256);
        let pixelCount = 0;

        for (let y = startY; y < endY; y++) {
          const yOff = y * width;
          for (let x = startX; x < endX; x++) {
            const val = Math.max(0, Math.min(255, Math.round(gray[yOff + x])));
            hist[val]++;
            pixelCount++;
          }
        }

        const clipLimit = Math.max(1, Math.round((pixelCount / 256) * clipFactor));
        let excess = 0;
        for (let i = 0; i < 256; i++) {
          if (hist[i] > clipLimit) {
            excess += hist[i] - clipLimit;
            hist[i] = clipLimit;
          }
        }

        const redist = Math.floor(excess / 256);
        const remainder = excess % 256;
        for (let i = 0; i < 256; i++) {
          hist[i] += redist + (i < remainder ? 1 : 0);
        }

        const cdf = new Float32Array(256);
        let cum = 0;
        for (let i = 0; i < 256; i++) {
          cum += hist[i];
          cdf[i] = (cum / pixelCount) * 255.0;
        }
        cdfs[ty][tx] = cdf;
      }
    }

    const output = new Float32Array(len);
    for (let y = 0; y < height; y++) {
      const tyF = (y - tileH / 2) / tileH;
      const ty0 = Math.max(0, Math.min(numTilesY - 1, Math.floor(tyF)));
      const ty1 = Math.max(0, Math.min(numTilesY - 1, ty0 + 1));
      const yWeight = Math.max(0, Math.min(1, tyF - ty0));
      const yOffset = y * width;

      for (let x = 0; x < width; x++) {
        const txF = (x - tileW / 2) / tileW;
        const tx0 = Math.max(0, Math.min(numTilesX - 1, Math.floor(txF)));
        const tx1 = Math.max(0, Math.min(numTilesX - 1, tx0 + 1));
        const xWeight = Math.max(0, Math.min(1, txF - tx0));

        const val = Math.max(0, Math.min(255, Math.round(gray[yOffset + x])));
        const v00 = cdfs[ty0][tx0][val];
        const v01 = cdfs[ty0][tx1][val];
        const v10 = cdfs[ty1][tx0][val];
        const v11 = cdfs[ty1][tx1][val];

        const top = v00 * (1 - xWeight) + v01 * xWeight;
        const bottom = v10 * (1 - xWeight) + v11 * xWeight;
        const claheVal = top * (1 - yWeight) + bottom * yWeight;

        const blend = intensity / 100.0;
        const finalVal = gray[yOffset + x] * (1 - blend) + claheVal * blend;
        output[yOffset + x] = Math.max(0, Math.min(255, finalVal));
      }
    }
    return output;
  }

  static apply(gray, width, height, intensity = 65) {
    const normalized = this.normalizeIllumination(gray, width, height, 18);
    return this.applyCLAHE(normalized, width, height, intensity);
  }
}
